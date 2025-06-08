import { Repository } from "./interface/repository.js";
import { Model, Schema, UpdateQuery, model } from "mongoose"
import { Mapper } from "./interface/mapper.js";

export class MongodbRepository<TEntity, TDocument, TId = string, TFilters=any> implements Repository<TEntity, TId, TFilters> {
        protected instanceModel: Model<TDocument>;
        protected mapper: Mapper<TDocument, TEntity, TFilters>;
    
        protected constructor(schema: Schema, collection: string, mapper: Mapper<TDocument, TEntity, TFilters>) {
            this.instanceModel = model<TDocument>(collection, schema);
            this.mapper = mapper
        }

        public async findAll(page: number, pageSize: number): Promise<TEntity[]>{
            const skip = (page - 1) * pageSize;
            const documents = await this.execute(() => this.instanceModel.find({}).skip(skip).limit(pageSize));
            return documents.map(document => this.mapper.toEntity(document))
        }

        public async findById(id: TId): Promise<TEntity>{
            const document = await this.execute(() => this.instanceModel.findById(id))
            if (!document) return null
            return this.mapper.toEntity(document)
        }

        public async findOneBy(condition: Partial<TFilters>): Promise<TEntity | null>{
            const conditionDocument = this.mapper.toDocumentQuery(condition)
            const document = await this.execute(() => {
                return this.instanceModel.findOne(conditionDocument)
            })

            if (!document) return null;

            return this.mapper.toEntity(document)
        }

        public async findManyBy(condition: Partial<TFilters>, page: number, pageSize: number): Promise<TEntity[]>{
            console.log(condition)
            const skip = (page-1)*pageSize
            const conditionDocument = this.mapper.toDocumentQuery(condition)
            const documents = await this.execute(() => {
                return this.instanceModel.find(conditionDocument).skip(skip).limit(pageSize)
            })
            console.log(documents)
            return documents.map(document => this.mapper.toEntity(document))
        }

        public async create(entity: TEntity): Promise<void>{
           await this.execute(() => this.instanceModel.create(this.mapper.toDocument(entity)))
        }

        public async update(object: any | Partial<TEntity>, id: TId): Promise<void>{
           await this.execute(() => this.instanceModel.findByIdAndUpdate(
            id,
            { $set: this.mapper.toUpdateDocument(object) }, 
            {new: true}))
        }

        public async delete(id: TId): Promise<void>{
            await this.execute(() => this.instanceModel.findByIdAndDelete(id))
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