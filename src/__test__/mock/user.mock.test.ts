// test/user.repository.mock.test.js
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { UserRepositoryMock } from "../../core/repository/user.mongodb.mock.repository.js";
import { UserEntity } from "../../core/entity/user.entity.js";

describe("UserRepositoryMock", () => {
    const repo = new UserRepositoryMock();

    const sampleUser = new UserEntity(
        "john_doe",
        "john@example.com",
        "",
        "abc123",
        new Date(), 
        new Date())

    test("should create and find user by id", async () => {
        await repo.create(sampleUser);
        const found = await repo.findById("abc123");
        assert.deepEqual(found, sampleUser);
    });

    test("should return null for non-existent id", async () => {
        const found = await repo.findById("doesnotexist");
        assert.equal(found, null);
    });

    test("should update existing user", async () => {
        await repo.update({ email: "updated@example.com" }, "abc123");
        const updated = await repo.findById("abc123");
        assert.equal(updated?.email, "updated@example.com");
    });

    test("should delete user", async () => {
        const deleted = await repo.delete("abc123");
        assert.equal(deleted?.id, "abc123");

        const afterDelete = await repo.findById("abc123");
        assert.equal(afterDelete, null);
    });

    test("should return empty array when paginating empty repo", async () => {
        const emptyRepo = new UserRepositoryMock();
        const users = await emptyRepo.findAll(1, 10);
        assert.deepEqual(users, []);
    });
});
