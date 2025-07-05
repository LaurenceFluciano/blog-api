import { BadRequestError } from "../../core/services/Error/validation.error.service.js"
import { isValidDate, validateDate } from "../../core/services/validation/validation.date.js"
import { Viewer } from "../../core/entity/article.entity.js"
// Command–Query Responsibility Segregation (CQRS) DTOS
// Arrumar validateDate: transformar em uma função externa que pode ser usado deiversas vezes
// DTOs de criação

class PostArticleDTO<GenericId> { 
    constructor(
        public readonly idUser: GenericId,
        public readonly title: string
    ){
        if(typeof this.idUser !== "string") {
            throw new BadRequestError("id do usuário fornecido é inválido")
        }

           if(typeof this.title !== "string") {
            throw new BadRequestError("Titulo do usuário fornecido é inválido")
        }
    }
}

// Busca
class GetArticleDTO<GenericId> {
    constructor(
        public readonly articleId: GenericId
    ){}
}
class GetMyArticleDTO<GenericId> {
    constructor(
        public readonly articleId: GenericId,
        public readonly idUser: GenericId
    ){}
}

// Busca com filtro
class FilterPublishedArticleDTO{
    public readonly updatedAt?: Date;

    constructor(
        public readonly author?: string,
        public readonly title?: string,
        public readonly content?: string,
        updatedAt?: Date | string,
    ) {
        if(this.author !== "string") {
            new BadRequestError("Nome de autor inválido")
        }
        if(this.title !== "string") {
            new BadRequestError("Nome de titulo inválido")
        }
        if(this.content !== "string") {
            new BadRequestError("Conteúdo inválido")
        }


        if (updatedAt === "string"){
            validateDate(updatedAt , "updatedAt")
            this.updatedAt = new Date(updatedAt)
        } else if (updatedAt instanceof Date) {
            this.updatedAt = updatedAt
        }

    }
}

class FilterMyArticlesDTO {
    public isPublished?: boolean;
    public readonly updatedAt?: Date;
    public readonly createdAt?: Date;

    constructor(
        public readonly idUser: string,
        public readonly title?: string,
        public readonly content?: string,
        updatedAt?: Date | string, 
        createdAt?: Date | string,
        isPublished?: boolean 
    ) {
        if(isPublished !== undefined ){
            if(typeof isPublished !== "boolean"){
                throw new BadRequestError("Filtro inválido")
            }
            this.isPublished = isPublished;
        }
        
        if (typeof updatedAt === "string") {
            validateDate(updatedAt, 'updatedAt');
            this.updatedAt = new Date(updatedAt);
        } else if (updatedAt instanceof Date) {
            this.updatedAt = updatedAt;
        }

        if (typeof createdAt === "string") {
            validateDate(createdAt, 'createdAt');
            this.createdAt = new Date(createdAt);
        } else if (createdAt instanceof Date) {
            this.createdAt = createdAt;
        }

    }
}

// Publicar artigo
class PublishArticleDTO<GenericId> {
    constructor(
        public readonly articleId: GenericId,
        public readonly idUser: GenericId,
        public readonly isPublished: boolean,
    ){}
}


// DTOs de resultado prévio
class ArticleSummaryDTO <GenericId> {
    public readonly updatedAt?: Date;
    constructor(
        public readonly articleId?: GenericId,
        public readonly imageURL?: string,
        public readonly author?: string,
        public readonly title?: string,
        updatedAt?: string | Date,
        public readonly viewers?: Array<GenericId>
    ){
        if (typeof updatedAt === 'string') {
            validateDate(updatedAt, 'updatedAt')
            this.updatedAt = new Date(updatedAt)
        } else if (updatedAt instanceof Date) {
                this.updatedAt = updatedAt;
        }
    }
}

// Resultado na página
class ArticleDetailDTO<GenericId> {

    constructor(
        public readonly articleId: GenericId,
        public readonly author: string,
        public readonly title: string,
        public readonly content: string,
        public readonly updatedAt: Date,
        public readonly imageURL?: string,
        public readonly viewers?: Viewer<GenericId>[]
    ){
    }
}

// DTOs de atualização
class UpdateArticleDTO {
    constructor(
        public readonly title?: string,
        public readonly imageUrl?: string,
        public readonly content?: string
    ){
        const titleEmpty = !this.title || this.title.trim() === "";
        const imageUrlEmpty = !this.imageUrl || this.imageUrl.trim() === "";
        const contentEmpty = !this.content || this.content.trim() === "";

        if (titleEmpty && imageUrlEmpty && contentEmpty) {
            throw new BadRequestError("Você não está atualizando nenhum campo.");
        }
    }
}

class UpdateCompleteArticleDTO {
  public readonly title: string;
  public readonly imageUrl: string;
  public readonly content: string;

  constructor(title: string, imageUrl: string, content: string) {
    if (!title?.trim() || !imageUrl?.trim() || !content?.trim()) {
      throw new BadRequestError('Todos os campos devem ser preenchidos para atualização completa.');
    }
    this.title = title;
    this.imageUrl = imageUrl;
    this.content = content;
  }
}

// Deletar artigo
class DeleteArticleDTO<GenericId> {
    constructor(
        public readonly idUser: GenericId,
        public readonly articleId: GenericId
    ){}
}



export {
    GetArticleDTO,
    ArticleDetailDTO,
    ArticleSummaryDTO,
    PostArticleDTO,
    UpdateArticleDTO,
    PublishArticleDTO,
    FilterPublishedArticleDTO,
    FilterMyArticlesDTO,
    DeleteArticleDTO,
    GetMyArticleDTO,
    UpdateCompleteArticleDTO
}
