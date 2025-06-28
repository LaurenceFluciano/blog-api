import { test, describe, it } from "node:test";
import assert from "node:assert/strict";
import { articleService } from "../../core/services/container/instance.js";
import { UpdateArticleDTO, GetArticleDTO } from "../../api/dtos/article.dto.js";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { CreateTestFactoryUser } from "../user.test.factory.js";
import { CreateTestFactoryArticle } from "../article.test.factory.js";
import { generateTestText } from "../tester.manager.js";
import { ArticleMongodbRepository } from "../../core/repository/article.mongodb.repository.js"; // Ajuste se precisar
import { UserRepositoryMongodb } from "../../core/repository/user.mongodb.repository.js";

const validImage = "https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg";

const createTestUser = new CreateTestFactoryUser();
const createTestArticle = new CreateTestFactoryArticle();

let articleRepository: ArticleMongodbRepository;
let userRepository: UserRepositoryMongodb;
let createdUser: any;
let createdValidArticle: any;

test.before(async () => {
  await mongooseConnection();

  articleRepository = new ArticleMongodbRepository();
  userRepository = new UserRepositoryMongodb();

  createdUser = await createTestUser.create(userRepository, {});

  createdValidArticle = await createTestArticle.create(articleRepository, {
    idUser: createdUser.id,
    title: "My Testing Article",
    content: generateTestText(100),
    imageUrl: validImage,
  });
});

test.after(async () => {
  await mongooseDisconnection();
});

describe("ArticleService - updateArticle", () => {
  it("Should update article successfully", async () => {
    const dtoUpdate = new UpdateArticleDTO("Updated Title", validImage, generateTestText(150));
    const dtoArticle = new GetArticleDTO(createdValidArticle.id);

    await assert.doesNotReject(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, createdUser.id);
    });
  });

  it("Should throw NotFoundError if article does not exist", async () => {
    const dtoUpdate = new UpdateArticleDTO("Valid Title", validImage, "Some content");
    const dtoArticle = new GetArticleDTO("000000000000000000000000"); // ID inválido

    await assert.rejects(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, createdUser.id);
    }, {
      name: "NotFoundError",
      message: /artigo/i
    });
  });

  it("Should throw NotFoundError if user is not the owner", async () => {
    const dtoUpdate = new UpdateArticleDTO("Valid Title", validImage, "Some content");
    const dtoArticle = new GetArticleDTO(createdValidArticle.id);
    const otherUserId = "000000000000000000000000"; // Outro usuário qualquer (não dono)

    await assert.rejects(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, otherUserId);
    }, {
      name: "NotFoundError",
      message: /recurso/i
    });
  });

  it("Should throw BadRequestError if title is invalid", async () => {
    const dtoUpdate = new UpdateArticleDTO("bad", validImage, "Some content"); // Título muito curto
    const dtoArticle = new GetArticleDTO(createdValidArticle.id);

    await assert.rejects(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, createdUser.id);
    }, {
      name: "BadRequestError",
      message: /título/i
    });
  });

  it("Should throw BadRequestError if image URL is inaccessible", async () => {
    const dtoUpdate = new UpdateArticleDTO("Valid Title", "http://invalid.url/image.png", "Some content");
    const dtoArticle = new GetArticleDTO(createdValidArticle.id);

    await assert.rejects(async () => {
      await articleService.updateArticle(dtoUpdate, dtoArticle, createdUser.id);
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


