import fs from "node:fs";
import path from "node:path";
import { QiitaTrendScraper } from "./services/scraper";
import { summarizer } from "./services/summarizer";
import type { article } from "./types/article.types";
import type { Env } from "./types/main.types";
import { formattedArticles } from "./utils/config";
import { Qiita } from "./utils/qiita";
import { Notification } from "./services/notification";

async function main() {
  /* Properties */
  const env_file_path = "../.env.local";
  const ENV: Env = {};

  /* Runtime start */
  console.log("[--INFO--] Start **Qiita trend article summary** program...");

  /* Checking is local env & setting env values... */
  const isLocal = fs.existsSync(path.join(__dirname, env_file_path)); // Make sure to set env file path in .gitignore file.
  if (isLocal) {
    const env = fs
      .readFileSync(path.join(__dirname, env_file_path), "utf8")
      .split("\n")
      .filter((line) => line.length > 0);
    env.forEach((line) => {
      const [key, value] = line.split("=");
      if (key) ENV[key] = value;
    });
  } else {
    ENV.GEMINI_API = process.env.GEMINI_API;
    ENV.QIITA_API = process.env.QIITA_API;
    ENV.MAIL_USER = process.env.MAIL_USER;
    ENV.MAIL_PASS = process.env.MAIL_PASS;
  }

  if (ENV.QIITA_API && ENV.GEMINI_API && ENV.MAIL_USER && ENV.MAIL_PASS) {
    console.log("[--INFO--] Getting Article data...");
    const qiita = new Qiita(ENV.QIITA_API);
    const scraper = new QiitaTrendScraper(qiita);
    const notification = new Notification(ENV.MAIL_USER, ENV.MAIL_PASS);
    const articles: article[] = await scraper.scrapeTrendArticles();

    console.log("[--INFO--] Summarizing articles...");
    const summarizedArticles = await summarizer(articles, ENV.GEMINI_API);

    console.log("[--INFO--] Formatting article...");
    const articleBody = formattedArticles(summarizedArticles).join("\n---\n");

    console.log("[--INFO--] Posting article...");
    const result = await qiita.postArticle(articleBody);

    if (result.status === "success") {
      console.log(
        "[--INFO--] Article posted successfully!\nYou can see the article at:",
        result.data,
      );

      console.log("[--INFO--] Sending notification mail...");

      const res = await notification.sendMail({
        from: ENV.MAIL_USER,
        to: ENV.MAIL_USER,
        subject: "Qiita Trend Article Summary",
        text: `Successfully posted article!\nYou can see the article at: ${result.data}`,
      });
      console.log(
        `[--INFO--] Response of mail sending: ${JSON.stringify(res)}`,
      );
    } else {
      console.log(
        "[--ERROR--] Failed to post article:",
        JSON.stringify(result.data),
      );

      const res = await notification.sendMail({
        from: ENV.MAIL_USER,
        to: ENV.MAIL_USER,
        subject: "Qiita Trend Article Summary",
        text: `Something went wrong!\nBelow is the error log: ${JSON.stringify(result.data)}`,
      });
      console.log(
        `[--INFO--] Response of mail sending: ${JSON.stringify(res)}`,
      );
    }
  } else {
    console.log("[--ERROR--] Couldn't get API key...");
  }
}

main();
