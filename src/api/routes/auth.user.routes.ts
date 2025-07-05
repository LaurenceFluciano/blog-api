import { Router } from "express";
import { asyncHandler } from "../../configs/async.handler.js";
import { userAuthController } from "../../core/services/container/instance.js";
import { authMiddleware } from "../middlewares/Auth/verify.user.acces.js";
const router = Router()

// Rota de autentificação de usuario

router.route("/login")
    .post(asyncHandler(userAuthController.login.bind(userAuthController)))

router.route("/profile")
    .get(authMiddleware,asyncHandler(userAuthController.profile.bind(userAuthController)))
    .put(authMiddleware, asyncHandler(userAuthController.updateProfile.bind(userAuthController)))

router.route("/refresh-token")
    .post(asyncHandler(userAuthController.refreshToken.bind(userAuthController)))

export {router}