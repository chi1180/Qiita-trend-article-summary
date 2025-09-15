interface Env {
  GEMINI_API?: string;
  QIITA_API?: string;
  [key: string]: string | undefined;
}

export type { Env };
