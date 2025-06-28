import { ArticleEntity } from "../entity/article.entity.js";
import { ArticleDocument } from "../schema/article.mongodb.schema.js";
import { ArticleMapper } from "./mapper/article.mapper.js";
import { ArticleSchema } from "../schema/article.mongodb.schema.js";
import { ArticleRepository } from "./interface/article.repository.js";
import { MongodbRepository } from "./mongodb.repository.js";
import { ArticleFilter } from "./filters/article.filter.js";
import { isValidObjectId } from "mongoose";

export class ArticleMongodbRepository 
extends MongodbRepository<ArticleEntity,ArticleDocument>
implements  ArticleRepository<ArticleEntity, string, ArticleFilter>
{
    constructor(){
        super(ArticleSchema, "Article", new ArticleMapper())
    }

    public async getTotalArticles(filter?: ArticleFilter): Promise<number> {
        if (!filter) return await this.instanceModel.countDocuments().exec();
        return await this.instanceModel.countDocuments(filter).exec();
    }

    public async publish(isPublished: boolean, id: string): Promise<null | boolean> {
        if (!isValidObjectId(id)) return null
        const objectId = this.mapper.toObjectId([id])[0];
    
        await this.execute(() =>
            this.instanceModel.updateOne(
                { _id: objectId },
                { $set: { isPublished } }
            )
        );
        return isPublished
    }

    public async setViewer(articleId: string, viewerId: string): Promise<void | null> {
        if (!isValidObjectId(articleId) || !isValidObjectId(viewerId)) return null
        await this.execute(() => 
            this.instanceModel.updateOne(
                {_id: articleId}, 
                // $push ou $addToSet (recomendavel)
                { $addToSet: { viewers: {userId: viewerId, viewedAt: new Date()} }}
            )
        )
    }

    public async getViewers(articleId: string): Promise<string[] | null> {
        const result = await this.instanceModel.findById(articleId);
        if (!result) return null;
        
        const viewers = result.viewers?.map(v => v.userId.toString());
        return viewers ?? [];
    }
}
