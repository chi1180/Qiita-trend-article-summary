import type { article } from "../types/article.types";
import { Gemini } from "../utils/gemini";

async function summarizer(articles: article[], gemini_token: string) {
  const gemini = new Gemini(gemini_token);
  const summarizedArticles = await gemini.generateSummary(articles);
  return summarizedArticles;
}

export { summarizer };
