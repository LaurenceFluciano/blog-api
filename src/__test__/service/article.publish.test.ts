import { test, describe, it } from "node:test";
import assert from "node:assert/strict";
import { articleService } from "../../core/services/container/instance.js";
import { GetArticleDTO, PublishArticleDTO } from "../../api/dtos/article.dto.js";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { generateTestText } from "../tester.manager.js";
import { UserRepositoryMongodb } from "../../core/repository/user.mongodb.repository.js";
import { ArticleMongodbRepository } from "../../core/repository/article.mongodb.repository.js";
import { CreateTestFactoryArticle } from "../article.test.factory.js";
import { CreateTestFactoryUser } from "../user.test.factory.js";

const validImage = "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?fm=jpg&q=60&w=3000";

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
  await articleRepository.delete(createdValidArticle.id);
  await userRepository.delete(createdUser.id);
  await mongooseDisconnection();
});


describe("Should publish and unpublish article - publishOrUnpublishArticle", () => {
  it("should publish article successfully", async () => {
    const dto = new PublishArticleDTO(createdValidArticle.id, createdUser.id, true);

    await assert.doesNotReject(async () => {
      await articleService.publishOrUnpublishArticle(dto);
    });
  });

  it("should unpublish article successfully", async () => {
    const dto = new PublishArticleDTO(createdValidArticle.id, createdUser.id, false);

    await assert.doesNotReject(async () => {
      await articleService.publishOrUnpublishArticle(dto);
    });
  });

  it("should throw NotFoundError if article not found", async () => {
    const dto = new PublishArticleDTO("000000000000000000000000", createdUser.id, true);

    await assert.rejects(
      async () => {
        await articleService.publishOrUnpublishArticle(dto);
      },
      {
        name: "NotFoundError",
        message: /artigo/i,
      }
    );
  });

  it("should throw NotFoundError if user is not owner", async () => {
    const dto = new PublishArticleDTO(createdValidArticle.id, "000000000000000000000000", true);

    await assert.rejects(
      async () => {
        await articleService.publishOrUnpublishArticle(dto);
      },
      {
        name: "NotFoundError",
        message: /recurso/i,
      }
    );
  });

  it("should throw BadRequestError if article content too short", async () => {
    const articleWithShortContent = await createTestArticle.create(articleRepository, {
      title: "Testing",
      idUser: createdUser.id,
      content: "short",
      imageUrl: validImage,
    });

    const dto = new PublishArticleDTO(articleWithShortContent.id, createdUser.id, true);

    await assert.rejects(
      async () => {
        await articleService.publishOrUnpublishArticle(dto);
      },
      {
        name: "BadRequestError",
        message: "O conteúdo do artigo é muito pequeno.",
      }
    );

    await articleRepository.delete(articleWithShortContent.id);
  });

  it("should throw BadRequestError if article has no image", async () => {
    const articleWithoutImage = await createTestArticle.create(articleRepository, {
      title: "Testing",
      idUser: createdUser.id,
      content: generateTestText(100),
      imageUrl: "",
    });

    const dto = new PublishArticleDTO(articleWithoutImage.id, articleWithoutImage.idUser, true);

    await assert.rejects(
      async () => {
        await articleService.publishOrUnpublishArticle(dto);
      },
      {
        name: "BadRequestError",
        message: "Seu artigo não tem uma imagem",
      }
    );

    await articleRepository.delete(articleWithoutImage.id);
  });
});

