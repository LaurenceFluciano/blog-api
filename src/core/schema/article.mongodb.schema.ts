import {Schema, Document, Types } from "mongoose"
import { ArticleEntity } from "../entity/article.entity.js"

type ArticleProps = Omit<ArticleEntity<Types.ObjectId>, 'id' | 'createdAt' | 'updatedAt'>;

export interface ArticleDocument extends Document, ArticleProps {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export const ArticleSchema = new Schema<ArticleDocument>(
    {
        title: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: false,
            lowercase: true,
            trim: true,
        },
        content: {
            type: String,
            required: false,
        },
        idUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        viewers: [{
            userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            viewedAt: { type: Date },
        }]
    }, 
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
) 