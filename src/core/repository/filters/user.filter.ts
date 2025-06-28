export class UserFilter {
    constructor(
        public username?: string,
        public email?: string,
        public createdAt?: Date,
        public updatedAt?: Date
    ){}
}

export class UserFilterFactory {
    static create(filters: UserFilter): UserFilter {
        const filter = new UserFilter();

        Object.keys(filters).forEach(key => {
            const value = filters[key as keyof UserFilter];

            if (value !== undefined) {
                if (value instanceof Date) {
                    filter[key as keyof UserFilter] = new Date(value) as any;
                } else {
                    filter[key as keyof UserFilter] = value as any;
                }
            }
        });

        return filter;
    }
}