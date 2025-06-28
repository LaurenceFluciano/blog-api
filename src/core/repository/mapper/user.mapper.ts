import { Mapper } from "../interface/mapper.js";
import { UserEntity } from "../../entity/user.entity.js";
import { UserDocument } from "../../schema/user.mongodb.schema.js";
import { UserFilter } from "../filters/user.filter.js"
import { FilterQuery, Types } from "mongoose";


export class UserMapper implements Mapper<UserDocument,UserEntity, UserFilter> {
    toEntity(document: UserDocument): UserEntity {
        return new UserEntity(
            document.username,
            document.email,
            document?.password,
            document?._id.toString(),
            document?.createdAt,
            document?.updatedAt
        )
    }
    toDocument(entity: UserEntity): UserDocument {
        return {
            id: entity?.id,
            username: entity.username,
            email: entity.email,
            password: entity.password 
        } as UserDocument
    }
    toUpdateDocument(filter: Partial<UserEntity>): Partial<UserDocument> {
        const doc: any = {};
        if (filter.username !== undefined) doc.username = filter.username;
        if (filter.email !== undefined) doc.email = filter.email;
        if (filter.password !== undefined) doc.password = filter.password;
        return doc as Partial<UserDocument>;
    }

    toDocumentQuery(condition: Partial<UserFilter>): FilterQuery<UserDocument> {
        const result: any = {} ;
        if (condition.username) result.username = {$regex: `^${condition.username}`, $options: 'i'};
        if (condition.email) result.email = condition.email;
        if (condition.createdAt) {
            result.createdAt = {
                $gte: condition.createdAt,
                $lte: new Date()
            };
        }

        if (condition.updatedAt) {
            result.updatedAt = {
                $gte: condition.updatedAt,
                $lte: new Date()
            };
        }
        return result as FilterQuery<UserDocument>;
    }
}