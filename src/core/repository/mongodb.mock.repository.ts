import { Repository } from "./interface/repository.js";

export class MongodbRepositoryMock<TEntity, TId = string, TFilters=any> implements Repository<TEntity, TId, TFilters> {
    private data: TEntity[] = [];

    async findAll(page: number, pageSize: number): Promise<TEntity[]> {
        const start = (page - 1) * pageSize;
        return this.data.slice(start, start + pageSize);
    }
    async findById(id: TId): Promise<TEntity | null> {
        const entity = this.data.find(e => (e as any).id === id);
        return entity || null;
    }
    async findOneBy(condition: Partial<TFilters>): Promise<TEntity | null> {
        const entity = this.data.find(e => {
            for (const key in condition) {
                if ((e as any)[key] !== condition[key as keyof TFilters]) return false;
            }
            return true;
        });
        return entity || null;
    }
    async findManyBy(condition: Partial<TFilters>, page: number, pageSize: number): Promise<TEntity[]> {
        const filtered = this.data.filter(e => {
            for (const key in condition) {
                if ((e as any)[key] !== condition[key as keyof TFilters]) return false;
            }
            return true;
        });
        const start = (page -1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }
    async create(entity: TEntity): Promise<TEntity | null> {
        this.data.push(entity);
        return entity;
    }
    async update(entity: Partial<TEntity> | any, id: TId): Promise<void> {
        const index = this.data.findIndex(e => (e as any).id === id);
        if (index === -1) throw new Error("Not found");
        this.data[index] = { ...this.data[index], ...entity };
    }
    async delete(id: TId): Promise<TEntity | null> {
        const index = this.data.findIndex(e => (e as any).id === id);
        if (index === -1) return null;
        const [removed] = this.data.splice(index, 1);
        return removed;
    }
}
