import { ArticleService } from "../article.service.js";
import { UserService } from "../user.service.js";
import { ArticleValidator } from "../validation/article.validation.js";
import { ArticleMongodbRepository } from "../../repository/article.mongodb.repository.js";
import { UserRepositoryMongodb } from "../../repository/user.mongodb.repository.js";
import { UserAuthService } from "../Auth/user.auth.service.js";
import { UserAuthController } from "../../../api/controllers/Auth/user.auth.controller.js";
import { UserController } from "../../../api/controllers/user.controller.js";
import { ArticleController } from "../../../api/controllers/blog.controller.js";
import { UserValidator } from "../validation/user.validation.js";


// Simple Container implemetation
export const userRepository = new UserRepositoryMongodb()
const userValidator = new UserValidator()
export const userService = new UserService(userRepository,userValidator)
const articleValidator = new ArticleValidator()
const articleRepository = new ArticleMongodbRepository()
export const articleService = new ArticleService(articleRepository,userService,articleValidator)
export const userAuthService = new UserAuthService(userRepository, userValidator)

// Controllers
export const userController = new UserController(userService)
export const userAuthController = new UserAuthController(userAuthService)
export const articleController = new ArticleController(articleService)

// se quiser usar tsringe, inversify e typedi será melhor a implementação
/*
@injectable() em cima da classe
container.register("Database", {
  useClass: SomeDatabaseImplementation
});
@injectable()
class Foo {
  constructor(@inject("Database") private database?: Database) {}
*/