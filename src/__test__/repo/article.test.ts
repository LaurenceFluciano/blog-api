import {test, describe, it} from "node:test";
import assert from "assert";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { ArticleMongodbRepository } from "../../core/repository/article.mongodb.repository.js";
import { Types } from "mongoose";
import { ArticleEntity } from "../../core/entity/article.entity.js";
let articleRepository: ArticleMongodbRepository;
let validUserId =  "6838757eabec9faaf69239d5"
let validArticleID = "683bab2d6c07ac7604b49229"

test.before(async () => {
  await mongooseConnection();
  articleRepository = new ArticleMongodbRepository();
});

test.after(async () => {
  await mongooseDisconnection();
});


describe("ArticleMongodbRepository", () => {
    it("Should get total articles (without filter)", async () => {
        const total = await articleRepository.getTotalArticles();
        assert(total > 0, `Expected total > 0 but got ${total}`);
    });

    it("Should get total articles (with filter)", async () => {
        const total = await articleRepository.getTotalArticles({idUser: validUserId});
        assert(total >= 1, `Expected filtered total >= 1 but got ${total}`);
    });

    it("Should publish an article", async () => {
        await articleRepository.publish(true, validArticleID);
        const updated = await articleRepository.findById(validArticleID);
        assert.strictEqual(updated.isPublished, true, "Expected isPublished to be true");
    });

    it("Should return true when publishing an article", async () => {
        const result = await articleRepository.publish(true, validArticleID);
        assert.strictEqual(result, true, "Expected publish to return true");
    });

    it("Should return false when unpublishing an article", async () => {
        const result = await articleRepository.publish(false, validArticleID);
        assert.strictEqual(result, false, "Expected publish to return false");
    });

    it("Should return null for invalid ID", async () => {
        const result = await articleRepository.publish(true, "invalid_id");
        assert.strictEqual(result, null, "Expected publish to return null for invalid ID");
    });

    it("Should set a viewer", async () => {
        const viewerId = new Types.ObjectId().toString();
        await articleRepository.setViewer(validArticleID, viewerId);

        const article = await articleRepository.findById(validArticleID);
        const viewers = article.viewers.map(v => v.userId.toString());

        assert(viewers.includes(viewerId), `Viewer ${viewerId} should have been added`);
    });

    it("Shouldn't set a viewer in invalid article id", async () => {
        const result = await articleRepository.setViewer(validArticleID, 'asd');

        assert.strictEqual(result, null, "Should be null when is invalid userId");
    });
    it("Shouldn't set a invalid viewer", async () => {
        const result = await articleRepository.setViewer('asdasd', validUserId);

        assert.strictEqual(result, null, "Should be null when is invalid userId");
    });
    it("Shouldn't set a invalid viewer and invalid article", async () => {
        const result = await articleRepository.setViewer('asdasd', 'asda');

        assert.strictEqual(result, null, "Should be null when is invalid userId");
    });

    it("Should get viewers", async () => {
        const viewers = await articleRepository.getViewers(validArticleID);
        assert(Array.isArray(viewers), "Expected viewers to be an array");
        assert(viewers.length > 0, "Expected at least one viewer");
    });
});