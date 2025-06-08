class PageDTO {
    constructor(
        public readonly page: number = 1, //default
        public readonly pageSize: number = 100 //default
    ) {}
}

class PaginatedResponse<T> {
    constructor(
        public readonly items: T[],
        public readonly pageItemCount: number,
        public readonly total: number,
        public readonly page: number,
        public readonly pageSize: number
    ) {}
}

export {PageDTO,PaginatedResponse}