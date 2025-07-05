import { Router } from "express";
const router = Router()
import { articleController } from "../../core/services/container/instance.js";
import { asyncHandler } from "../../configs/async.handler.js";
import { authMiddleware } from "../middlewares/Auth/verify.user.acces.js";
import { validateAllIdParams } from "../middlewares/validator.middleware.id.js";


router.route("/articles/")
    .post(authMiddleware,asyncHandler(articleController.createArticle.bind(articleController)))
    .get(authMiddleware,asyncHandler(articleController.searchAllMyArticlesSummary.bind(articleController)))
    
router.route("/articles/:id")
    .all(validateAllIdParams)
    .put(authMiddleware, asyncHandler(articleController.updateEntireMyArticle.bind(articleController)))
    .patch(authMiddleware, asyncHandler(articleController.updatePartialMyArticle.bind(articleController)))
    .delete(authMiddleware, asyncHandler(articleController.deleteMyArticle.bind(articleController)))
    .get(authMiddleware, asyncHandler(articleController.getMyArticleDetail.bind(articleController)))

router.route("/articles/:id/publish")
    .all(validateAllIdParams)
    .put(authMiddleware, asyncHandler(articleController.publishOrUnpublishArticle.bind(articleController)))

router.route("/feed/")
    .get(authMiddleware, asyncHandler(articleController.getAllPublishedArticles.bind(articleController)))

router.route("/feed/:id")
    .get(authMiddleware, asyncHandler(articleController.getPublishedDetailArticle.bind(articleController)))

export { router }