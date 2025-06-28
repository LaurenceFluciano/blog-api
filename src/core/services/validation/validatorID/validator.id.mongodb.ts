import { Types } from "mongoose";

export class IdValidatorMongo {
    static isValid(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }

    static ensure(id: string): void {
        if (!this.isValid(id)) {
            throw new Error(`Invalid Mongo ObjectId: ${id}`);
        }
    }
}