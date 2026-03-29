export type Note = {
  slug: string;
  title: string;
  content: string;
  html: string;
  date?: string;
  tags: string[];
};

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};
