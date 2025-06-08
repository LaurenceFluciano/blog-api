export interface Repository<T, GenericId, GenericFilters> {
    findAll(page: number, pageSize: number): Promise<T[]>;
    findById(id: GenericId): Promise<T>;
    findOneBy(condition: Partial<GenericFilters>): Promise<T | null>;
    findManyBy(condition: Partial<GenericFilters>, page: number, pageSize: number): Promise<T[]>;
    create(entity: T): Promise<void>;
    update(entity: Partial<T> | any, id: GenericId): Promise<void>;
    delete(id: GenericId): Promise<void>;
}

