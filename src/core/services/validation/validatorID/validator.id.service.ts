import { IdValidatorMongo } from "./validator.id.mongodb.js";

export class ValidatorIdService {
  static isMongoId(id: string): boolean {
    return IdValidatorMongo.isValid(id);
  }

  static currentValidate(id: string): void {
    IdValidatorMongo.ensure(id);
  }
}