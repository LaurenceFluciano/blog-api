import {test, describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { articleService } from "../../core/services/container/instance.js";
import { DeleteArticleDTO, FilterMyArticlesDTO } from "../../api/dtos/article.dto.js";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { PageDTO } from "../../api/dtos/pagination.dto.js";
import { CreateTestFactoryArticle } from "../article.test.factory.js";
import { CreateTestFactoryUser } from "../user.test.factory.js";
import { ArticleMongodbRepository } from "../../core/repository/article.mongodb.repository.js";
import { UserRepositoryMongodb } from "../../core/repository/user.mongodb.repository.js";

/*SETUP*/
const createTestUser = new CreateTestFactoryUser()
const createTestArticle = new CreateTestFactoryArticle()

let articleRepository: ArticleMongodbRepository;
let userRepository: UserRepositoryMongodb;
let createdUser: any;
let createdArticle: any;

test.before(async () => {
  await mongooseConnection();
  articleRepository = new ArticleMongodbRepository();
  userRepository = new UserRepositoryMongodb();

  createdUser = await createTestUser.create(userRepository, {})
  createdArticle = await createTestArticle.create(articleRepository, { idUser: createdUser.id })
});

test.after(async () => {
    await userRepository.delete(createdUser.id)
    await mongooseDisconnection();
});

describe("ArticleService - delete", () => {
    it("Should delete article sucessfully", async () => {
        await articleService.deleteArticle(new DeleteArticleDTO(createdUser.id,createdArticle.id))

        const articles = await articleService.searchAllMyArticlesSummary(new PageDTO(1,10), 
        new FilterMyArticlesDTO(createdUser.id))
        const result = articles.items.find(a => a.articleId === createdArticle.id);
        assert.strictEqual(result, undefined, "Article must be deleted");
    });
})


