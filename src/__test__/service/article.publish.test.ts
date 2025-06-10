import { test, describe, it } from "node:test";
import assert from "node:assert/strict";
import { articleService } from "../../core/services/container/instance.js";
import { PublishArticleDTO } from "../../api/dtos/article.dto.js";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";

const validArticleId = "684892c7171dec6b052ba071"; // substitua por ID válido do seu banco
const validUserId = "683df103e8b3de5f70a6c731";

test.before(async () => {
  await mongooseConnection();
});

describe("Should publish and unpublish article - publishOrUnpublishArticle", () => {
  it("should publish article successfully", async () => {
    const dto = new PublishArticleDTO(validArticleId,validUserId, true);

    await assert.doesNotReject(async () => {
      await articleService.publishOrUnpublishArticle(dto);
    });
  });

  it("should unpublish article successfully", async () => {
    const dto = new PublishArticleDTO(validArticleId, validUserId, false);
    await assert.doesNotReject(async () => {
      await articleService.publishOrUnpublishArticle(dto);
    });
  });

  it("should throw NotFoundError if article not found", async () => {
    const dto = new PublishArticleDTO("000000000000000000000000",validUserId,true);

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
    const dto = new PublishArticleDTO<string>(validArticleId, "000000000000000000000000",true);

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
  /*
  it("should throw BadRequestError if article content too short", async () => {
    // Aqui, pra testar o conteúdo curto, você pode criar um artigo de teste com conteúdo curto no banco
    // Ou assumir que o artigo real tem conteúdo ok e não testar isso aqui diretamente (é complicado sem mocks)
    // Se quiser, deixe pra testar isso isoladamente.
  });

  it("should throw BadRequestError if article has no image", async () => {
    // Mesmo esquema que o anterior, depende de dados específicos no banco.
    // Poderia ter um artigo de teste para isso.
  });*/
});

test.after(async () => {
  await mongooseDisconnection();
});
