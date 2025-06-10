import {test, describe, it} from "node:test";
import assert from "assert";
import { mongooseConnection, mongooseDisconnection } from "../../configs/mongodbConnection.js";
import { UserRepositoryMongodb } from "../../core/repository/user.mongodb.repository.js";
import { Types } from "mongoose";
import { UserEntity } from "../../core/entity/user.entity.js";
let userRepository: UserRepositoryMongodb;

test.before(async () => {
  await mongooseConnection();
  userRepository = new UserRepositoryMongodb();
});

test.after(async () => {
  await mongooseDisconnection();
});

describe("UserRepositoryMongodb - findById", () => {
  it("Should find user by id", async () => {
    const id = "67e5946f9cae9a9bff05af14"; 
    const user = await userRepository.findById(id);
    assert(user !== null, "User should not be null");
    assert.strictEqual(user?.id, id, "User id should match");
  });
  it("Should return null if the id is not valid", async () => {
    const id = "error"; 
    const user = await userRepository.findById(id); 

    assert.strictEqual(user, null, "User should be null when not valid")
  });
  it("Should return null if the repository doesn't find user", async () => {
    const id = new Types.ObjectId().toString()
    const user = await userRepository.findById(id)

    assert.strictEqual(user, null, "User should be null when not found")
  })
})

describe("UserRepositoryMongodb - findAll", () => {
  it("Should find all users", async () => {
    const users =await userRepository.findAll(1,50) 

    assert(Array.isArray(users), "Should return an array");

    assert(users.length >= 0, "Should return at least one user");

    assert(users[0] instanceof UserEntity, "First item should be instance of UserEntity");

  });
  it("Should return a empty array when the page are less than 0", async () => {
    const users =await userRepository.findAll(-1,2) 

    assert(Array.isArray(users), "Should return an array");

    assert(users.length === 0, "Array length shoul be less than one");
  });
  it("Should return a empty array when number is not integer", async () => {
    const users =await userRepository.findAll(2.3,1.2) 

    assert(Array.isArray(users), "Should return an array");

    assert(users.length === 0, "Array length shoul be less than one");
  });
})

describe("UserRepositoryMongodb - findOneBy and findManyById", () => {
  it("Should get a user by email", async () => {
    const user = await userRepository.findOneBy({ email: "jonh@gmail.com" });
    assert(user instanceof UserEntity, "User should be a UserEntity");
  });

  it("Should get users by username", async () => {
    const users = await userRepository.findManyBy({ username: "test" }, 1, 10);
    assert(Array.isArray(users), "Should return an array");
    assert(users.length > 0, "Users array should not be empty");
    assert(users[0] instanceof UserEntity, "First user should be a UserEntity");
  });

  it("Should get users by updated Date", async () => {
    const users = await userRepository.findManyBy(
      { updatedAt: new Date("2025-05-29") },
      1,
      10
    );
    assert(Array.isArray(users), "Should return an array");
    assert(users.length > 0, "Users array should not be empty");
    assert(users[0] instanceof UserEntity, "First user should be a UserEntity");
  });

  it("Should get users by Created Date", async () => {
    const users = await userRepository.findManyBy(
      { createdAt: new Date("2025-05-29") },
      1,
      10
    );
    assert(Array.isArray(users), "Should return an array");
    assert(users.length > 0, "Users array should not be empty");
    assert(users[0] instanceof UserEntity, "First user should be a UserEntity");
  });

  it("Shouldn't get a user by email", async () => {
    const user = await userRepository.findOneBy({ email: "sadjaskdj" });
    assert.strictEqual(user, null, "User should be null when not found");
  });
  it("Shouldn't return a empty array", async () => {
    const users = await userRepository.findManyBy({ username: "sadjaskdj" }, 1,10);
    assert(Array.isArray(users), "Should return an array");
    assert.strictEqual(users.length, 0, "Users array should be empty when username not found");
  });
  it("Should get many users that starts with \"j or J\"", async () => {
    const users = await userRepository.findManyBy({username: "j"},1,10);
    assert(Array.isArray(users), "Should return an array")
    assert(users.length > 0, "Users array should not be empty");
    assert(users[0] instanceof UserEntity, "First user should be a UserEntity")
    assert(/^[jJ]/.test(users[0]["username"]), "The first letter should be \"j or J\"")
  })
});


describe("UserRepositoryMongodb - create and delete", () => {
  it("Should create an user", async () => {
    const user = await userRepository.create(new UserEntity("JOSÉ","josevintro@test.com","ThePassword-123"))
    assert.notEqual(user, null, "Shouldn't be null")
    await userRepository.delete(user.id)
    const result = await userRepository.findById(user.id)
    assert.strictEqual(result, null, "User should be null after deletion");
  })
})

