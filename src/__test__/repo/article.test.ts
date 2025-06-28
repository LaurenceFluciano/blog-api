import {test, describe, it} from "node:test";
import assert from "assert";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { ArticleMongodbRepository } from "../../core/repository/article.mongodb.repository.js";
import { Types } from "mongoose";
import { CreateTestFactoryArticle } from "../article.test.factory.js";
import { CreateTestFactoryUser } from "../user.test.factory.js";
import { UserRepositoryMongodb } from "../../core/repository/user.mongodb.repository.js";

const createTestArticle = new CreateTestFactoryArticle()
const createTestUser = new CreateTestFactoryUser()
let userRepository: UserRepositoryMongodb;
let articleRepository: ArticleMongodbRepository;

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
    await articleRepository.delete(createdArticle.id)
    await userRepository.delete(createdUser.id)
    await mongooseDisconnection();
});


describe("ArticleMongodbRepository", () => {
    it("Should get total articles (without filter)", async () => {
        const total = await articleRepository.getTotalArticles();
        assert(total > 0, `Expected total > 0 but got ${total}`);
    });

    it("Should get total articles (with filter)", async () => {
        const total = await articleRepository.getTotalArticles({idUser: createdUser.id});
        assert(total >= 1, `Expected filtered total >= 1 but got ${total}`);
    });

    it("Should publish an article", async () => {
        await articleRepository.publish(true, createdArticle.id);
        const updated = await articleRepository.findById(createdArticle.id);
        assert.strictEqual(updated.isPublished, true, "Expected isPublished to be true");
    });

    it("Should return true when publishing an article", async () => {
        const result = await articleRepository.publish(true,  createdArticle.id);
        assert.strictEqual(result, true, "Expected publish to return true");
    });

    it("Should return false when unpublishing an article", async () => {
        const result = await articleRepository.publish(false,  createdArticle.id);
        assert.strictEqual(result, false, "Expected publish to return false");
    });

    it("Should return null for invalid ID", async () => {
        const result = await articleRepository.publish(true, "invalid_id");
        assert.strictEqual(result, null, "Expected publish to return null for invalid ID");
    });

    it("Should set a viewer", async () => {
        const viewerId = new Types.ObjectId().toString();
        await articleRepository.setViewer( createdArticle.id, viewerId);

        const article = await articleRepository.findById( createdArticle.id);
        const viewers = article.viewers.map(v => v.userId.toString());

        assert(viewers.includes(viewerId), `Viewer ${viewerId} should have been added`);
    });

    it("Shouldn't set a viewer in invalid article id", async () => {
        const result = await articleRepository.setViewer( createdArticle.id, 'asd');

        assert.strictEqual(result, null, "Should be null when is invalid userId");
    });
    it("Shouldn't set a invalid viewer", async () => {
        const result = await articleRepository.setViewer('asdasd',  createdUser.id);

        assert.strictEqual(result, null, "Should be null when is invalid userId");
    });
    it("Shouldn't set a invalid viewer and invalid article", async () => {
        const result = await articleRepository.setViewer('asdasd', 'asda');

        assert.strictEqual(result, null, "Should be null when is invalid userId");
    });

    it("Should get viewers", async () => {
        const viewers = await articleRepository.getViewers( createdArticle.id);
        assert(Array.isArray(viewers), "Expected viewers to be an array");
        assert(viewers.length > 0, "Expected at least one viewer");
    });
});
