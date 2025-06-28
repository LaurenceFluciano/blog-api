export interface Viewer<ID = string> {
    userId: ID;
    viewedAt?: Date;
}

export class ArticleEntity<ID = string> {
    constructor(
        public title: string,
        public idUser: ID,
        public isPublished?: boolean,
        public viewers?: Viewer<ID>[],
        public content?: string,
        public imageUrl?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: ID,
    ){}
}