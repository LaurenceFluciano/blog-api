import { ArticleEntity } from "../core/entity/article.entity.js";
import { ArticleFilter } from "../core/repository/filters/article.filter.js";
import { ArticleRepository } from "../core/repository/interface/article.repository.js";
import { AbstractTestCreateFactory } from "./tester.manager.js";

export class CreateTestFactoryArticle implements AbstractTestCreateFactory<
  ArticleRepository<ArticleEntity, string, ArticleFilter>,
  ArticleEntity, 
  string,    
  ArticleFilter 
> {
  async create(
    repository: ArticleRepository<ArticleEntity, string, ArticleFilter>, 
    obj: Partial<ArticleEntity>
  ): Promise<ArticleEntity> {

    if (!obj.idUser) {
      throw new Error("idUser é obrigatório para criar artigo");
    }

    const article = new ArticleEntity(
        obj.title || "Hello World!",
        obj.idUser,
        obj.isPublished || false,
        [],
        obj.content || "", 
        obj.imageUrl || ""
    );

    Object.assign(article, obj);
    await repository.create(article);
    const result = await repository.findOneBy({idUser: obj.idUser, title: obj.title })
    return result;
  }
}
