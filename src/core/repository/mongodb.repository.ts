import { Repository } from "./interface/repository.js";
import { Model, Schema, isValidObjectId, model } from "mongoose"
import { Mapper } from "./interface/mapper.js";

export class MongodbRepository<TEntity, TDocument, TId = string, TFilters=any> implements Repository<TEntity, TId, TFilters> {
        protected instanceModel: Model<TDocument>;
        protected mapper: Mapper<TDocument, TEntity, TFilters>;
    
        protected constructor(schema: Schema, collection: string, mapper: Mapper<TDocument, TEntity, TFilters>) {
            this.instanceModel = model<TDocument>(collection, schema);
            this.mapper = mapper
        }

        public async findAll(page: number, pageSize: number): Promise<TEntity[]>{
            if (!Number.isInteger(page) || !Number.isInteger(pageSize) || page <= 0 || pageSize <= 0) {
                return [] as TEntity[];
            }
            const skip = (page - 1) * pageSize;
            const documents = await this.execute(() => this.instanceModel.find({}).skip(skip).limit(pageSize));
            return documents.map(document => this.mapper.toEntity(document))
        }

        public async findById(id: TId): Promise<TEntity | null>{
            if (!isValidObjectId(id)) return null;
            const document = await this.execute(() => this.instanceModel.findById(id))
            if (!document) return null
            return this.mapper.toEntity(document)
        }

        public async findOneBy(condition: Partial<TFilters>): Promise<TEntity | null>{
            console.log(condition)
            const conditionDocument = this.mapper.toDocumentQuery(condition)
            const document = await this.execute(() => {
                return this.instanceModel.findOne(conditionDocument)
            })

            if (!document) return null;

            return this.mapper.toEntity(document)
        }

        public async findManyBy(condition: Partial<TFilters>, page: number, pageSize: number): Promise<TEntity[]>{
            if (!Number.isInteger(page) || !Number.isInteger(pageSize) || page <= 0 || pageSize <= 0) {
                return [] as TEntity[];
            }
            const skip = (page-1)*pageSize
            const conditionDocument = this.mapper.toDocumentQuery(condition)
            const documents = await this.execute(() => {
                return this.instanceModel.find(conditionDocument).skip(skip).limit(pageSize)
            })
            return documents.map(document => this.mapper.toEntity(document))
        }

        public async create(entity: TEntity): Promise<TEntity | null>{
            if (!entity) return null
            const document = await this.execute(() => this.instanceModel.create(this.mapper.toDocument(entity)))
            if (!document) return null
            return this.mapper.toEntity(document)
        }

        public async update(object: any | Partial<TEntity>, id: TId): Promise<void>{
           await this.execute(() => this.instanceModel.findByIdAndUpdate(
            id,
            {$set: this.mapper.toUpdateDocument(object)}, 
            {new: true}))
        }

        public async delete(id: TId): Promise<TEntity | null>{
            if (!isValidObjectId(id)) return null;
            const deleted = await this.execute(() => this.instanceModel.findByIdAndDelete(id))
            return deleted ? this.mapper.toEntity(deleted) : null;
        }

        protected async execute<Result>(
            callback: () => Promise<Result>): Promise<Result>
        {
            try {
                return await callback()
            } catch (err) {
                throw new Error(`Error to execute query: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
}

