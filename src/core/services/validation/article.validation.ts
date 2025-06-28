import { BadRequestError, NotFoundError } from "../Error/validation.error.service.js";
import { ArticleEntity } from "../../entity/article.entity.js";
import { PublishArticleDTO } from "../../../api/dtos/article.dto.js";
import axios from "axios";

export class ArticleValidator {

    public isValidTitle(value: string) {
        const regex = /^[\p{L}0-9\s.,!?'"()\-–—:;]+$/u;
        
        if (!value || value.trim().length < 5 || value.length > 100) {
            throw new BadRequestError("O título deve ter entre 5 e 100 caracteres.");
        }

        if (!regex.test(value.trim())) {
            throw new BadRequestError("O título contém caracteres inválidos.");
        }
    }

    public hasArticle(value: ArticleEntity | null | undefined): void {
        if(!value) {
            throw new NotFoundError("Artigo não encontrado")
        }
    }

    public hasContentArticle(article: ArticleEntity): void {
        if(article.content === undefined || article.content.length <= 100) {
            throw new BadRequestError("O conteúdo do artigo é muito pequeno.")
        }
    }

    public async hasImageArticle(image: string): Promise<void> {
        if(!image) throw new BadRequestError("Seu artigo não tem uma imagem")
        const url = image.trim()

        if(!url) throw new BadRequestError("Seu artigo não tem uma imagem.")

    }
        
    public async isValidImage(image: string): Promise<void> {
            try {
                const response = await axios.head(image)
                //const contentType = response.headers["content-type"];
    
                /*if(!contentType.startsWith("image/")) {
                    throw new BadRequestError("A URL fornecida não é uma imagem válida")
                }*/
    
            } catch(err) {
                console.log(err)
                throw new BadRequestError("Não foi possível acessar a imagem fornecida.")
            }
    }

    public verifyOwnerArticle(user: ArticleEntity, dtoUserId: PublishArticleDTO<string>["idUser"]): void {
        if(user.idUser !== dtoUserId) {
            throw new NotFoundError("Recurso não encontrado") // NotFound ou Unauthorized
        }
    }
}
