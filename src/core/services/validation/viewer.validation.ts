import { ArticleEntity } from "../../entity/article.entity.js";

export class ViewerService {
    public static hasViewerArticle(id: string, article: ArticleEntity<string>): boolean {
        return article.viewers?.some(v => v.userId === id) ?? false
    }
}