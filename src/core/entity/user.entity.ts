export class UserEntity {
    constructor(
        public username: string,
        public email: string,
        public password?: string,
        public id?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ){}
}