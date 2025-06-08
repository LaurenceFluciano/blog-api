export interface Viewer<ID = string> {
    userId: ID;
    viewedAt?: Date;
}

export class ArticleEntity<ID = string> {
    constructor(
        public readonly title: string,
        public readonly idUser: ID,
        public readonly isPublished?: boolean,
        public readonly viewers?: Viewer<ID>[],
        public readonly content?: string,
        public readonly imageUrl?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public readonly id?: ID,
    ){}
}