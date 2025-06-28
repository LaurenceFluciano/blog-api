import { ArticleEntity } from "../../entity/article.entity.js";
import { Repository } from "./repository.js";

export interface ArticleRepository<T extends ArticleEntity, GenericId, GenericFilter extends any> extends Repository<T,GenericId, GenericFilter>{
    getTotalArticles(filter?: GenericFilter):Promise<number>;
    publish(isPublish: boolean, id: string): Promise<null | boolean>;
    setViewer(article: GenericId, viewerId: GenericId): Promise<void | null>;
    getViewers(article: GenericId):Promise<GenericId[] | null>;
}