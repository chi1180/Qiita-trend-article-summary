import { url } from "node:inspector";
import type { article } from "../types/article.types";
import { URL } from "node:url";
import type { Item } from "../types/qiita.types";

export class Qiita {
  private readonly accessToken: string;
  private readonly endPoint =
    "https://qiita.com/api/v2/items?page=1&per_page=30";

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async fetchTrendArticles(articles: article[]) {
    for (const article of articles) {
      const response = await fetch(
        encodeURI(`${this.endPoint}&query=user:${article.author}`),
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );
      const result = (await response.json()) as Item[];
      const target = result.find((item: Item) => item.id === article.id);
      console.log(`[--DEBUG--] ${JSON.stringify(target?.title)}`);
    }
  }
}
