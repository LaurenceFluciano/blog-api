import { Repository } from "./repository.js";
import { UserEntity } from "../../entity/user.entity.js";
import { UserFilter } from "../filters/user.filter.js";

export interface UserRepository<T extends UserEntity, GenericId, GenericFilters extends UserFilter> extends Repository<T, GenericId, GenericFilters> {

}