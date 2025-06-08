import { FilterQuery, Types } from "mongoose";

export interface Mapper<D, E, F> {
    toEntity(document: D): E; 
    toDocument(entity: E): D; 
    toDocumentQuery(condition: Partial<F>): FilterQuery<Partial<D>>;
    toUpdateDocument(condition: Partial<E> | any): Partial<D>; 
    toObjectId?(ids: string[]): Types.ObjectId[];
}

