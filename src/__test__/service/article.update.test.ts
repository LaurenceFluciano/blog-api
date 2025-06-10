import { test, describe, it } from "node:test";
import assert from "node:assert/strict";
import { articleService } from "../../core/services/container/instance.js";
import { UpdateArticleDTO, GetArticleDTO } from "../../api/dtos/article.dto.js";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";

// Use valid data from your database
const validArticleId = "684892c7171dec6b052ba071";
const validUserId = "683df103e8b3de5f70a6c731";
const validImageUrl = "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg";
const validContent = "Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content! Creative content!"


test.before(async () => {
  await mongooseConnection();
});

describe("ArticleService - updateArticle", () => {
  it("Should update article successfully", async () => {
    const dtoUpdate = new UpdateArticleDTO("Updated Title", validImageUrl, validContent);
    const dtoArticle = new GetArticleDTO(validArticleId);

    await assert.doesNotReject(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, validUserId);
    });
  });

  it("Should throw NotFoundError if article does not exist", async () => {
    const dtoUpdate = new UpdateArticleDTO("Valid Title", validImageUrl, "Some content");
    const dtoArticle = new GetArticleDTO("invalidArticleId");

    await assert.rejects(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, validUserId);
    }, {
      name: "NotFoundError",
      message: /artigo/i
    });
  });

  it("Should throw NotFoundError if user is not the owner", async () => {
    const dtoUpdate = new UpdateArticleDTO("Valid Title", validImageUrl, "Some content");
    const dtoArticle = new GetArticleDTO(validArticleId);
    const otherUserId = "someOtherUserId";

    await assert.rejects(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, otherUserId);
    }, {
      name: "NotFoundError",
      message: /recurso/i
    });
  });

  it("Should throw BadRequestError if title is invalid", async () => {
    const dtoUpdate = new UpdateArticleDTO("bad", validImageUrl, "Some content"); // Title too short
    const dtoArticle = new GetArticleDTO(validArticleId);

    await assert.rejects(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, validUserId);
    }, {
      name: "BadRequestError",
      message: /título/i
    });
  });

  it("Should throw BadRequestError if image URL is inaccessible", async () => {
    const dtoUpdate = new UpdateArticleDTO("Valid Title", "http://invalid.url/image.png", "Some content");
    const dtoArticle = new GetArticleDTO(validArticleId);

    await assert.rejects(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, validUserId);
    }, {
      name: "BadRequestError",
      message: /imagem/i
    });
  });

  it("Should throw BadRequestError if DTO has no fields to update", () => {
    assert.throws(() => {
      new UpdateArticleDTO("", "", "");
    }, {
      name: "BadRequestError",
      message: /nenhum campo/i
    });
  });
});

test.after(async () => {
  await mongooseDisconnection();
});