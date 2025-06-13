import { UserEntity } from "../core/entity/user.entity.js";
import { UserRepository } from "../core/repository/interface/user.repository.js";
import { UserFilter } from "../core/repository/filters/user.filter.js";
import { AbstractTestCreateFactory } from "./tester.manager.js";

export class CreateTestFactoryUser implements AbstractTestCreateFactory<
  UserRepository<UserEntity, string, UserFilter>, // R
  UserEntity, 
  string,    
  UserFilter 
> {
  async create(
    repository: UserRepository<UserEntity, string, UserFilter>, 
    obj: Partial<UserEntity>
  ): Promise<UserEntity> {

    const user = new UserEntity(
      obj.username || "testerman",
      obj.email || "testerman@gmail.com",
      obj.password || "A-123456b"
    );

    Object.assign(user, obj);
    let result = await repository.findOneBy({email: user.email})
    if (!result) {
        await repository.create(user);
        result = await repository.findOneBy({email: user.email})
    }
    return result;
  }
}

