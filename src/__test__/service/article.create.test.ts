import { test, describe, it } from "node:test";
import assert from "node:assert/strict";
import { articleService } from "../../core/services/container/instance.js";
import { PostArticleDTO } from "../../api/dtos/article.dto.js";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { CreateTestFactoryUser } from "../user.test.factory.js";
import { UserRepositoryMongodb } from "../../core/repository/user.mongodb.repository.js";

const createUser = new CreateTestFactoryUser();
const userRepository = new UserRepositoryMongodb();

let user: any;
let validUserId: string;

test.before(async () => {
  await mongooseConnection();
  user = await createUser.create(userRepository, {});
  validUserId = user.id;
});


test.after(async () => {
  await userRepository.delete(validUserId);
  await mongooseDisconnection();
});


describe("ArticleService - createArticle", () => {

  it("Should create an article with valid fields", async () => {
    const dto = new PostArticleDTO(validUserId, "Test Title");

    await assert.doesNotReject(async () => {
      await articleService.createArticle(dto);
    });
  });

  it("Should throw error with invalid user ID", async () => {
    const dto = new PostArticleDTO("000000000000000000000000", "Test Title"); 

    await assert.rejects(
      async () => {
        await articleService.createArticle(dto);
      },
      {
        name: "NotFoundError",
        message: /usuário/i,
      }
    );
  });

  it("Should throw an error with invalid title (empty)", async () => {
    const dto = new PostArticleDTO(validUserId, "");

    await assert.rejects(
      async () => {
        await articleService.createArticle(dto);
      },
      {
        name: "BadRequestError",
        message: /título/i,
      }
    );
  });

  it("Should throw an error with short title", async () => {
    const dto = new PostArticleDTO(validUserId, "Hi");

    await assert.rejects(
      async () => {
        await articleService.createArticle(dto);
      },
      {
        name: "BadRequestError",
        message: /título/i,
      }
    );
  });
});
