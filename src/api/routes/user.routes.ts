import { Router } from "express";
import { userController } from "../../core/services/container/instance.js";
import { asyncHandler } from "../../configs/asyncHandler.js";
const router = Router()
// Rota de usuário

router.route("/")
    .post(asyncHandler(userController.createUser.bind(userController)))


export {router}