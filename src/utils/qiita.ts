import type { article } from "../types/article.types";
import type { Item } from "../types/qiita.types";
import { postingArticleConfig } from "./config";

export class Qiita {
  private readonly accessToken: string;
  private readonly endPoint = "https://qiita.com/api/v2/items";

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async fetchTrendArticles(articles: article[]) {
    for (const article of articles) {
      const response = await fetch(
        encodeURI(
          `${this.endPoint}?page=1&per_page=30&query=user:${article.author}`,
        ),
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );
      const result = (await response.json()) as Item[];
      const target = result.find((item: Item) => item.id === article.id);
      if (target) {
        article.tags = target.tags.map(({ name }) => name);
        article.likes = target.likes_count;
        article.stocks = target.stocks_count;
        article.comments = target.comments_count;
        article.postedAt = new Date(target.created_at)
          .toLocaleString("ja-JP")
          .split(" ")[0];
        article.updatedAt = new Date(target.updated_at)
          .toLocaleString("ja-JP")
          .split(" ")[0];
        article.body = target.body;
      }
    }

    return articles;
  }

  async postArticle(article_body: string) {
    const postingBody = postingArticleConfig(article_body);
    const response = await fetch(this.endPoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(postingBody),
    });

    const result = (await response.json()) as Item;

    if (result?.url) {
      return {
        status: "success",
        data: result.url,
      };
    }

    return {
      status: "failed",
      data: result,
    };
  }
}
