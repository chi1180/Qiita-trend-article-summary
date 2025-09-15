/**
 * There are some configs for this program.
 */

import type { article } from "../types/article.types";

const prompt = (
  body: string,
) => `あなたのタスクは、Qiitaの記事を簡潔に要約することです。
- 出力は必ず **プレーンテキストのみ** にしてください。
- 箇条書きや記号を使ってもかまいませんが、Markdown、HTML、JSON、コードブロック、その他の装飾は一切使わないでください。
- 文章は読みやすく、内容を正確に保ちながら短くまとめてください。
- 出力には必ず要約本文のみを含め、説明や前置き、指示の繰り返しなどは不要です。

対象記事:
${body}
`;

const formattedArticles = (articles: article[]) =>
  articles.map((article) => {
    return `# [${article.title}](${article.url})

${article.tags?.map((tag) => `[${tag}](https://qiita.com/tags/${tag})`).join(", ")}

- ${article.likes} Likes, ${article.stocks} Stocks, ${article.comments} Comments
- POSTED @ ${article.postedAt}___UPDATED @ ${article.updatedAt}
- Author : @${article.author}

${article.summary
  ?.split("\n")
  .map((line) => `> ${line}`)
  .join("\n")}
`;
  });

const postingArticleConfig = (article_body: string) => {
  return {
    title: "Qiitaのトレンド記事を要約してまとめたもの（サボり）",
    tags: [
      { name: "Qiita" },
      { name: "AI" },
      { name: "要約" },
      { name: "時短" },
    ],
    body: article_body,
  };
};

export { prompt, formattedArticles, postingArticleConfig };
