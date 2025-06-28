import { test, describe } from "node:test";
import assert from "assert";
import { ArticleRepositoryMock } from "../../core/repository/article.mongodb.mock.repository.js";
import { UserRepositoryMock } from "../../core/repository/user.mongodb.mock.repository.js";
import { ArticleEntity } from "../../core/entity/article.entity.js";
import { UserEntity } from "../../core/entity/user.entity.js";

let userRepository: UserRepositoryMock;
let articleRepository: ArticleRepositoryMock;

let createdUser: UserEntity;
let createdArticle: ArticleEntity;

test.before(() => {
    userRepository = new UserRepositoryMock();
    articleRepository = new ArticleRepositoryMock();

    createdUser = new UserEntity("mockuser", "mock@email.com", "", "user123", new Date(), new Date());
    userRepository.create(createdUser);

    createdArticle = new ArticleEntity(
        "Título do artigo",
        createdUser.id,
        false, 
        [],  
        "Conteúdo aqui...",
        "https://imagem.com/img.png",
        new Date(),
        new Date(),
        "article123"
    );

    articleRepository.create(createdArticle);
});

describe("ArticleRepositoryMock", () => {
    test("Should get total articles (without filter)", async () => {
        const total = await articleRepository.getTotalArticles();
        assert(total > 0);
    });

    test("Should get total articles (with filter)", async () => {
        const total = await articleRepository.getTotalArticles({ idUser: createdUser.id });
        assert(total >= 1);
    });

    test("Should publish an article", async () => {
        await articleRepository.publish(true, createdArticle.id);
        const updated = await articleRepository.findById(createdArticle.id);
        assert.strictEqual(updated?.isPublished, true);
    });

    test("Should return true when publishing an article", async () => {
        const result = await articleRepository.publish(true, createdArticle.id);
        assert.strictEqual(result, true);
    });

    test("Should return false when unpublishing an article", async () => {
        const result = await articleRepository.publish(false, createdArticle.id);
        assert.strictEqual(result, false);
    });

    test("Should return null for invalid ID", async () => {
        const result = await articleRepository.publish(true, "invalid_id");
        assert.strictEqual(result, null);
    });

    test("Should set a viewer", async () => {
        const viewerId = "viewer123";
        await articleRepository.setViewer(createdArticle.id, viewerId);

        const article = await articleRepository.findById(createdArticle.id);
        const viewers = article?.viewers?.map(v => v.userId) || [];

        assert(viewers.includes(viewerId));
    });

    test("Shouldn't set a viewer with invalid viewerId", async () => {
        const result = await articleRepository.setViewer(createdArticle.id, "");
        assert.strictEqual(result, null);
    });

    test("Shouldn't set viewer with invalid article id", async () => {
        const result = await articleRepository.setViewer("invalid_article", createdUser.id);
        assert.strictEqual(result, null);
    });

    test("Shouldn't set viewer if both IDs are invalid", async () => {
        const result = await articleRepository.setViewer("x", "y");
        assert.strictEqual(result, null);
    });

    test("Should get viewers", async () => {
        const viewerId = "another_viewer";
        await articleRepository.setViewer(createdArticle.id, viewerId);

        const viewers = await articleRepository.getViewers(createdArticle.id);
        assert(Array.isArray(viewers));
        assert(viewers.length > 0);
    });
});
