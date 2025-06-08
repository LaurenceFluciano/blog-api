import { ArticleEntity } from "../../entity/article.entity.js";
import { Repository } from "./repository.js";

export interface ArticleRepository<T extends ArticleEntity, GenericId, GenericFilter extends any> extends Repository<T,GenericId, GenericFilter>{
    getTotalArticles(filter?: GenericFilter):Promise<number>;
    publish(isPublish: boolean, id: string): void;
    setViewer(article: GenericId, viewerId: GenericId): void;
    getViewers(article: GenericId):Promise<GenericId[] | null>;
}