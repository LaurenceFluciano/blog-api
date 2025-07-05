import { ArticleService } from "../../core/services/article.service.js"
import { Request, Response } from "express"
import { PostArticleDTO, 
        GetArticleDTO, 
        UpdateArticleDTO, 
        FilterMyArticlesDTO, 
        FilterPublishedArticleDTO,
        DeleteArticleDTO,
        PublishArticleDTO, 
        UpdateCompleteArticleDTO,
        GetMyArticleDTO} from "../dtos/article.dto.js"
import { PageDTO } from "../dtos/pagination.dto.js"
import { GetUserByIdDTO } from "../dtos/user.dto.js"
import { BadRequestError } from "../../core/services/Error/validation.error.service.js"

export class ArticleController {
    constructor(
        private articleService: ArticleService
    ){}


    public async createArticle(req: Request, res:Response) {
        const body = req.body
        const user = req.user
        await this.articleService.createArticle(
            new PostArticleDTO(
                user.id,
                body.title)
        )
        res.status(201).json({message: "Artigo criado com sucesso"})
    }

    public async searchAllMyArticlesSummary(req: Request, res: Response) {
        const objectQuery = {
            userId: req.user.id as string | undefined,
            title: req.query.title as string | undefined, 
            content: req.query.content as string | undefined, 
            updatedAt: req.query.updatedAt as string | Date | undefined, 
            createdAt: req.query.createdAt as string | Date | undefined
        }
     
        const filters = new FilterMyArticlesDTO(
            objectQuery.userId,
            objectQuery.title,
            objectQuery.content,
            objectQuery.updatedAt,
            objectQuery.createdAt)

        const result = await this.articleService.searchAllMyArticlesSummary(new PageDTO(1,10),filters)

        res.status(200).json(result)
    }

    public async updatePartialMyArticle(req: Request, res: Response) {
        const id = req.params.id
        const body = req.body
        const userid = req.user.id

        const updateParams = new UpdateArticleDTO(
            body.title,
            body.imageUrl,
            body.content
        )
        await this.articleService.updateArticle(updateParams,new GetArticleDTO(id),userid)
        res.status(200).json({message: "Artigo atualizado com sucesso!"})
    }

    public async updateEntireMyArticle(req: Request, res: Response) {
        const id = req.params.id
        const body = req.body
        const userid = req.user.id

        const updateParams = new UpdateCompleteArticleDTO(
            body.title,
            body.imageUrl,
            body.content
        )
        await this.articleService.updateArticle(updateParams,new GetArticleDTO(id),userid)
        res.status(200).json({message: "Artigo atualizado com sucesso!"})
    }

    public async getAllPublishedArticles(req: Request, res: Response) {
        const objectQuery = {
            author: req.query.author as string | undefined,
            title: req.query.title as string | undefined,
            content: req.query.content as string | undefined,
            updatedAt: req.query.updatedAt as string | Date | undefined
        }

        const dto = new FilterPublishedArticleDTO(
            objectQuery.author,
            objectQuery.title,
            objectQuery.content,
            objectQuery.updatedAt
        )

        const result = await this.articleService.searchPublishedArticles(new PageDTO(1,10),dto)
        res.status(200).json(result)
    }

    public async getPublishedDetailArticle(req: Request, res: Response) {
        const result = await this.articleService.getPublishedArticleDetailById(new GetArticleDTO(req.params.id as string), new GetUserByIdDTO(req.user.id))
        res.status(200).json(result)
    }

    public async getMyArticleDetail(req: Request, res:Response) {
        const result = await this.articleService.getMyArticleDetail(new GetMyArticleDTO(req.params.id,req.user.id))
        res.status(200).json(result)
    }

    public async publishOrUnpublishArticle(req: Request, res: Response) {
        const isPublished = req.body.publish === true || req.body.publish === 'true'; 
        const messsage = await this.articleService.publishOrUnpublishArticle(new PublishArticleDTO(req.params.id, req.user.id,isPublished))
        res.status(200).json({message: messsage})
    }

    public async deleteMyArticle(req: Request, res: Response) {
        await this.articleService.deleteArticle(new DeleteArticleDTO(req.user.id,req.params.id as string))
        res.status(200).json({message: "Artigo removido com sucesso."})
    }
}