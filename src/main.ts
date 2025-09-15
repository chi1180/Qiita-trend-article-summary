import fs from "node:fs";
import path from "node:path";
import { QiitaTrendScraper } from "./services/scraper";
import type { Env } from "./types/main.types";

function main() {
  /* Properties */
  const env_file_path = "../.env.local";
  const ENV: Env = {};

  /* Runtime start point */
  console.log("[--INFO--] Start **Qiita trend article summary** program...");

  console.log("[--INFO--] Getting API data...");
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
  }

  if (ENV.QIITA_API) {
    const scraper = new QiitaTrendScraper(ENV.QIITA_API);
    scraper.scrapeTrendArticles();
  } else {
    console.log("[--ERROR--] Couldn't get API key...");
  }
}

main();
