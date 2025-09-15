import * as cheerio from "cheerio";
import type { article } from "../types/article.types";
import { Qiita } from "../utils/qiita";

export class QiitaTrendScraper {
  private baseUrl = "https://qiita.com";
  private qiita: Qiita;

  constructor(qiita_access_token: string) {
    this.qiita = new Qiita(qiita_access_token);
  }

  async scrapeTrendArticles() {
    const ARTICLES: article[] = [];

    const response = await fetch(this.baseUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    const articles = $(".style-2vm86z");
    for (const article of articles) {
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

    this.qiita.fetchTrendArticles(ARTICLES);
  }
}
