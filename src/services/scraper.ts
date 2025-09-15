import * as cheerio from "cheerio";
import type { article } from "../types/article.types";
import { Qiita } from "../utils/qiita";

export class QiitaTrendScraper {
  private baseUrl = "https://qiita.com";
  private qiita: Qiita;

  constructor(qiita: Qiita) {
    this.qiita = qiita;
  }

  async scrapeTrendArticles() {
    const ARTICLES: article[] = [];

    const response = await fetch(this.baseUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    const articlesHtml = $(".style-2vm86z");
    for (const article of articlesHtml) {
      const article_data: article = {
        title: $(article).text(),
        url: $(article).attr("href"),
      };
      if (article_data.url) {
        const split_url = article_data.url.split("/items/") || "";
        if (split_url[0]) article_data.author = split_url[0].split("/").at(-1);
        if (split_url[1]) article_data.id = split_url[1];
      }
      ARTICLES.push(article_data);
    }

    /* Getting article properties */
    const articles = await this.qiita.fetchTrendArticles(ARTICLES);
    return articles;
  }
}
