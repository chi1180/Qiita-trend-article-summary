import { GoogleGenAI } from "@google/genai";
import type { article } from "../types/article.types";
import { prompt } from "./config";

export class Gemini {
  private readonly apiToken: string;
  ai: GoogleGenAI;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.ai = new GoogleGenAI({
      apiKey: this.apiToken,
    });
  }

  async generateSummary(articles: article[]) {
    let articleCount = 0;
    for (const article of articles) {
      console.log(
        `[--INFO--] Generating summary of article (${articleCount++}/${articles.length})...`,
      );

      if (!article.body) throw new Error("Article body is missing");

      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt(article.body),
      });

      article.summary = response.text;

      console.log(
        `[--INFO--] Generated summary of ${article.title}, sleep for 5 seconds...`,
      );
      await Bun.sleep(1000 * 5);
    }
    return articles;
  }
}
