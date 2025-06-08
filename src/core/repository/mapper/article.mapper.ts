import { Mapper } from "../interface/mapper.js";
import { ArticleEntity } from "../../entity/article.entity.js";
import { ArticleDocument } from "../../schema/article.mongodb.schema.js";
import { FilterQuery, Schema, Types } from "mongoose";
import { ArticleFilter } from "../filters/article.filter.js";

export class ArticleMapper implements Mapper<ArticleDocument, ArticleEntity, ArticleFilter> {
    toDocument(entity: ArticleEntity<string>): ArticleDocument {
        return {
            title: entity.title,
            imageUrl: entity.imageUrl,
            content: entity.content,
            idUser: new Types.ObjectId(entity.idUser),
            isPublished: entity.isPublished,
            viewers: (entity.viewers ?? []).map(viewer => ({
                userId: new Types.ObjectId(viewer.userId),
                viewedAt: viewer.viewedAt
            })),
        } as ArticleDocument
    }

    toUpdateDocument(udpateObject: any | Partial<ArticleEntity>): Partial<ArticleDocument> {
        const updates: any = {};

        if (udpateObject.title !== undefined) updates.title = udpateObject.title;
        if (udpateObject.content !== undefined) updates.content =  udpateObject.content;
        if (udpateObject.imageUrl !== undefined) updates.imageUrl =  udpateObject.imageUrl;

        updates.updatedAt = new Date(); 

        return updates as Partial<ArticleDocument>;
    }

    toEntity(document: ArticleDocument): ArticleEntity<string> {
        return new ArticleEntity(
            document.title, 
            document.idUser.toString(),
            document.isPublished,
            document?.viewers.map(viewer => ({
                userId: viewer?.userId.toString(),
                viewedAt: viewer?.viewedAt
            })),
            document?.content,
            document?.imageUrl,
            document?.createdAt,
            document?.updatedAt,
            document?._id.toString()
        )
    }

   toDocumentQuery(condition: Partial<ArticleFilter>): FilterQuery<ArticleDocument> {
        const result: any = {};

        if (condition.createdAt) {
            result.createdAt = { $gte: condition.createdAt, $lte: new Date()} 
        }

        if (condition.updatedAt) {
            result.updatedAt = { $gte: condition.updatedAt, $lte: new Date()} 
        }

        if (condition.articleId) {
            result._id = new Types.ObjectId(condition.articleId);
        }

        if (condition.idUser) {
            result.idUser = new Types.ObjectId(condition.idUser);
        }

        if (condition.isPublished !== undefined) {
            result.isPublished = condition.isPublished;
        }

        if (condition.title !== undefined) {
            result.title = condition.title; 
        }

        if (condition.content !== undefined) {
            result.content = condition.content;
        }

        console.log(result)
        return result as FilterQuery<ArticleDocument>;
  }

  toObjectId(ids: string[]): Types.ObjectId[] {
    return ids.map(id => new Types.ObjectId(id))    
  }
}