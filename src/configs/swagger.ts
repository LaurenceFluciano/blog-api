import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog",
      version: "1.0.0",
      description: "API para gerenciamento de artigos, feed, usuários e autenticação."
    },
    paths: {
      "/api/blog/dashboard/articles/": {
        post: {
          tags: ["Blog"],
          summary: "Criar artigo",
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: "Artigo criado com sucesso." },
            401: { description: "Não autorizado." }
          }
        },
        get: {
          tags: ["Blog"],
          summary: "Buscar todos os artigos do usuário",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Lista dos artigos do usuário." },
            401: { description: "Não autorizado." }
          }
        }
      },
      "/api/blog/dashboard/articles/{id}": {
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do artigo"
          }
        ],
        put: {
          tags: ["Blog"],
          summary: "Atualizar artigo do usuário",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Artigo atualizado." },
            401: { description: "Não autorizado." },
            404: { description: "Artigo não encontrado." }
          }
        },
        delete: {
          tags: ["Blog"],
          summary: "Deletar artigo do usuário",
          security: [{ bearerAuth: [] }],
          responses: {
            204: { description: "Artigo deletado." },
            401: { description: "Não autorizado." },
            404: { description: "Artigo não encontrado." }
          }
        },
        get: {
          tags: ["Blog"],
          summary: "Detalhes do artigo do usuário",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Detalhes do artigo." },
            401: { description: "Não autorizado." },
            404: { description: "Artigo não encontrado." }
          }
        }
      },
      "/api/blog/dashboard/articles/{id}/publish": {
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do artigo"
          }
        ],
        put: {
          tags: ["Blog"],
          summary: "Publicar ou despublicar artigo",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Status de publicação alterado." },
            401: { description: "Não autorizado." },
            404: { description: "Artigo não encontrado." }
          }
        }
      },
      "/api/blog/feed/": {
        get: {
          tags: ["Blog"],
          summary: "Buscar todos artigos publicados",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Lista de artigos publicados." },
            401: { description: "Não autorizado." }
          }
        }
      },
      "/api/blog/feed/{id}": {
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do artigo publicado"
          }
        ],
        get: {
          tags: ["Blog"],
          summary: "Detalhes do artigo publicado",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Detalhes do artigo publicado." },
            401: { description: "Não autorizado." },
            404: { description: "Artigo não encontrado." }
          }
        }
      },
      "/api/user/": {
        post: {
          tags: ["User"],
          summary: "Criar usuário",
          responses: {
            201: { description: "Usuário criado com sucesso." },
            400: { description: "Requisição inválida." }
          }
        }
      },
      "/api/user/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login do usuário",
          responses: {
            200: { description: "Login bem sucedido, retorna token." },
            401: { description: "Credenciais inválidas." }
          }
        }
      },
      "/api/user/auth/profile": {
        get: {
          tags: ["Auth"],
          summary: "Obter perfil do usuário autenticado",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Dados do perfil do usuário." },
            401: { description: "Não autorizado." }
          }
        },
        put: {
          tags: ["Auth"],
          summary: "Atualizar perfil do usuário autenticado",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Perfil atualizado." },
            401: { description: "Não autorizado." }
          }
        }
      },
      "/api/user/auth/refresh-token": {
        post: {
          tags: ["Auth"],
          summary: "Atualizar token de autenticação",
          responses: {
            200: { description: "Token atualizado." },
            401: { description: "Token inválido ou expirado." }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // Pode manter se quiser ler comentários Swagger
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
