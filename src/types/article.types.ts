interface article {
  id?: string;
  title?: string;
  url?: string;
  author?: string;
  tags?: string[];
  likes?: number;
  stocks?: number;
  comments?: number;
  postedAt?: string;
  updatedAt?: string;
  body?: string;
  summary?: string;
}

export type { article };
