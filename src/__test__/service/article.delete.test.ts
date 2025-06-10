import {test, describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { articleService } from "../../core/services/container/instance.js";
import { DeleteArticleDTO, FilterMyArticlesDTO } from "../../api/dtos/article.dto.js";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { PageDTO } from "../../api/dtos/pagination.dto.js";


test.before(async () => {
  await mongooseConnection();
});

describe("ArticleService - delete", () => {
    it("Should delete article sucessfully", async () => {
        const userId = '6838757eabec9faaf69239d5';
        const articleId = '683b4e2edddbd168ddd81aa0';

        await articleService.deleteArticle(new DeleteArticleDTO(userId,articleId))

        const articles = await articleService.searchAllMyArticlesSummary(new PageDTO(1,10), 
        new FilterMyArticlesDTO(userId))
        console.log(articles.items.find(a => a.articleId === articleId))
        const result = articles.items.find(a => a.articleId === articleId);
        assert.strictEqual(result, undefined, "Article must be deleted");
    
    });
})


test.after(async () => {
  await mongooseDisconnection();
});