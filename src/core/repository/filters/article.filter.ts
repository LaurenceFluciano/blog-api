export class ArticleFilter {
  constructor(
    public title?: string | RegExp ,
    public articleId?: string,
    public idUser?: string,
    public isPublished?: boolean,
    public content?: string | RegExp ,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
