interface Env {
  GEMINI_API?: string;
  QIITA_API?: string;
  MAIL_USER?: string;
  MAIL_PASS?: string;
  [key: string]: string | undefined;
}

export type { Env };
