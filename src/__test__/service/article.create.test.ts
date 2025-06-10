import {test, describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { articleService } from "../../core/services/container/instance.js";
import { PostArticleDTO, DeleteArticleDTO, FilterMyArticlesDTO } from "../../api/dtos/article.dto.js";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { PageDTO } from "../../api/dtos/pagination.dto.js";

// 👇 Use um ID de usuário válido do seu banco
const validUserId = "683df103e8b3de5f70a6c731";

test.before(async () => {
  await mongooseConnection();
});

describe("ArticleService - createArticle", () => {
  it("Should creat an article with valid fields", async () => {
    const dto = new PostArticleDTO(validUserId, "test title");

    await assert.doesNotReject(async () => {
      await articleService.createArticle(dto);
    });
  });

  it("Should throw error with invalid user ID", async () => {
    const dto = new PostArticleDTO("invalid-id", "test title");

    await assert.rejects(async () => {
      await articleService.createArticle(dto);
    }, {
      name: "NotFoundError",
      message: /usuário/i
    });
  });

  it("Should throw an error with invalid title", async () => {
    const dto = new PostArticleDTO(validUserId, "");

    await assert.rejects(async () => {
      await articleService.createArticle(dto);
    }, {
      name: "BadRequestError",
      message: /título/i
    });
  });

  it("Should throw an error with short title", async () => {
    const dto = new PostArticleDTO(validUserId, "Hi");

    await assert.rejects(async () => {
      await articleService.createArticle(dto);
    }, {
      name: "BadRequestError",
      message: /título/i
    });
  });
});


test.after(async () => {
  await mongooseDisconnection();
});