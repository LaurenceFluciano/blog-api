import { ArticleRepository } from "../repository/interface/article.repository.js";
import { ArticleEntity } from "../entity/article.entity.js";
import { ArticleFilter } from "../repository/filters/article.filter.js";
import { 
    GetArticleDTO, 
    ArticleDetailDTO,
    ArticleSummaryDTO, 
    PostArticleDTO, 
    UpdateArticleDTO, 
    PublishArticleDTO , 
    FilterPublishedArticleDTO,
    FilterMyArticlesDTO,
    DeleteArticleDTO,
    GetMyArticleDTO} from "../../api/dtos/article.dto.js";
import { GetUserByIdDTO } from "../../api/dtos/user.dto.js";
import { UserService } from "./user.service.js";
import { ArticleValidator } from "./validation/article.validation.js";
import { BadRequestError, NotFoundError } from "./Error/validation.error.service.js";
import { PaginatedResponse, PageDTO } from "../../api/dtos/pagination.dto.js";
import { ViewerService } from "./validation/viewer.validation.js";

export class ArticleService {
    constructor( 
        private readonly repository: ArticleRepository<ArticleEntity, string, ArticleFilter>,
        private readonly userService: UserService,
        private readonly articleValidator: ArticleValidator
    ) {}

    public async searchPublishedArticles(pagination: PageDTO, filters?: FilterPublishedArticleDTO):  Promise<PaginatedResponse<ArticleSummaryDTO<string>>> {
        if (pagination.pageSize > 100) {
            throw new BadRequestError("O tamanho da página não pode ser maior que 50 itens.");
        }

        const effetiveFilters = {
            ...filters,
            isPublished: true
        }

        const publishedArticles = await this.repository.findManyBy(effetiveFilters, pagination.page, pagination.pageSize)
        const articlesSummary = await Promise.all(
            publishedArticles.map(async (article) => {
                const user = await this.userService.getUserById(article.idUser);
                return new ArticleSummaryDTO(
                    article.id,
                    article.imageUrl,
                    user.username,
                    article.title,
                    article.updatedAt
                )
            })
        );

        const total = await this.repository.getTotalArticles({isPublished: true})

        return new PaginatedResponse(articlesSummary,articlesSummary.length, total,pagination.page,pagination.pageSize)
    }

    public async getPublishedArticleDetailById(dto: GetArticleDTO<string>, user: GetUserByIdDTO) {
        const article = await this.repository.findById(dto.articleId)

        if(!article || article.isPublished === false) {
            throw new NotFoundError("Artigo não encontrado")
        }
        const author = await this.userService.getUserById(article.idUser);
        
        if (!(ViewerService.hasViewerArticle(user.userId,article))) {
            this.repository.setViewer(article.id, user.userId)
        }

        return new ArticleDetailDTO(
            article.id,
            author.username,
            article.title,
            article.content,
            article.updatedAt,
            article.imageUrl,
            article.viewers)
    }

    public async publishOrUnpublishArticle(dto: PublishArticleDTO<string>): Promise<string> {
        const article = await this.repository.findById(dto.articleId)
        this.articleValidator.hasArticle(article)
        this.articleValidator.isValidTitle(article.title)
        this.articleValidator.hasContentArticle(article)
        await this.articleValidator.hasImageArticle(article.imageUrl)
        await this.articleValidator.isValidImage(article.imageUrl)

        this.articleValidator.verifyOwnerArticle(article,dto.idUser)

        const result = await this.repository.publish(dto.isPublished,dto.articleId)

        if(result === null || result === undefined) throw new BadRequestError("Campos inválidos.")

        if(result) {
            return "Artigo publicado com sucesso!"
        } else {
            return "Artigo despublicado com sucesso!"
        }
    }

    public async deleteArticle(dto: DeleteArticleDTO<string>): Promise<void> {
        const article = await this.repository.findById(dto.articleId)
        this.articleValidator.hasArticle(article)

        this.articleValidator.verifyOwnerArticle(article,dto.idUser)

        const result = await this.repository.delete(article.id)
        if(!result) throw new BadRequestError("Erro ao deletar o artigo, tente novamente.")
    }

    public async searchAllMyArticlesSummary(pagination: PageDTO, filters: FilterMyArticlesDTO): Promise<PaginatedResponse<ArticleSummaryDTO<string>>>{
        if (pagination.pageSize > 100) {
            throw new BadRequestError("O tamanho da página não pode ser maior que 100 itens.");
        }

        const effectiveFilters = {
            ...filters
        }


        const articles = await this.repository.findManyBy(effectiveFilters, pagination.page, pagination.pageSize)
        
        const articlesSummary = await Promise.all(
            articles.map(async (article) => {
                const user = await this.userService.getUserById(article.idUser);
                return new ArticleSummaryDTO(
                    article.id,
                    article.imageUrl,
                    user.username,
                    article.title,
                    article.updatedAt
                )
            })
        );

        const totalFilters = {
            idUser: filters.idUser,
            ...(filters.isPublished !== undefined && { isPublished: filters.isPublished }),
        };

        const total = await this.repository.getTotalArticles(totalFilters);


        return new PaginatedResponse(articlesSummary,articlesSummary.length, total,pagination.page,pagination.pageSize)
    
    } 

    public async getMyArticleDetail(dto: GetMyArticleDTO<string>): Promise<ArticleDetailDTO<string>> {
        const rawArticle = await this.repository.findById(dto.articleId)
        this.articleValidator.hasArticle(rawArticle)
        this.articleValidator.verifyOwnerArticle(rawArticle, dto.idUser)
        const user = await this.userService.getUserById(rawArticle.idUser)

        return new ArticleDetailDTO(
            rawArticle.id,
            user.username,
            rawArticle.title,
            rawArticle.content,
            rawArticle.updatedAt,
            rawArticle.imageUrl
        )
    }

    public async createArticle(dto:PostArticleDTO<string>): Promise<void> {
        await this.userService.getUserById(dto.idUser)
        this.articleValidator.isValidTitle(dto.title)
        const result = await this.repository.create(new ArticleEntity(dto.title, dto.idUser))
        if(!result) throw new BadRequestError("Erro ao criar o artigo, tente novamente.")
    }

    public async updateArticle(
        dtoUpdate: UpdateArticleDTO,
        dtoId: GetArticleDTO<string>,
        userId: string
    ): Promise<void> {
        const article = await this.repository.findById(dtoId.articleId);
        this.articleValidator.hasArticle(article);
        this.articleValidator.verifyOwnerArticle(article, userId);
        if(dtoUpdate.title) this.articleValidator.isValidTitle(dtoUpdate.title)
        if(dtoUpdate.imageUrl) await this.articleValidator.isValidImage(dtoUpdate.imageUrl)

        await this.repository.update(dtoUpdate, article.id);
    }
}