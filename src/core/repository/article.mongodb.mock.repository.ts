import { ArticleEntity } from "../entity/article.entity.js";
import { ArticleFilter } from "./filters/article.filter.js";
import { ArticleRepository } from "./interface/article.repository.js";
import { MongodbRepositoryMock } from "./mongodb.mock.repository.js";

export class ArticleRepositoryMock
    extends MongodbRepositoryMock<ArticleEntity, string, ArticleFilter>
    implements ArticleRepository<ArticleEntity, string, ArticleFilter>
{
    async getTotalArticles(filter?: ArticleFilter): Promise<number> {
        if (!filter) return this["data"].length;
        return this["data"].filter(a => this.matchesFilter(a, filter)).length;
    }

    async publish(isPublished: boolean, id: string): Promise<null | boolean> {
        const article = this["data"].find(a => (a as any).id === id);
        if (!article) return null;
        article.isPublished = isPublished;
        return isPublished;
    }

    async setViewer(articleId: string, viewerId: string): Promise<void | null> {
        // Validação dos argumentos
        if (!articleId || !viewerId) return null;

        const article = this["data"].find(a => (a as any).id === articleId);
        if (!article) return null;

        article.viewers = article.viewers || [];

        const alreadyViewed = article.viewers.find((v: any) => v.userId === viewerId);
        if (!alreadyViewed) {
            article.viewers.push({ userId: viewerId, viewedAt: new Date() });
        }
        
        return;
    }

    async getViewers(articleId: string): Promise<string[] | null> {
        const article = this["data"].find(a => (a as any).id === articleId);
        if (!article) return null;
        return article.viewers?.map((v: any) => v.userId) || [];
    }

    private matchesFilter(entity: ArticleEntity, filter: Partial<ArticleFilter>): boolean {
        for (const key in filter) {
            if ((entity as any)[key] !== filter[key as keyof ArticleFilter]) return false;
        }
        return true;
    }
}
