export type SaveArticleRequest = {
  title: string;
  content: string;
  file: Express.Multer.File;
};
