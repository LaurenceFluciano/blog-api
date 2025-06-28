# RESTFul API de BLOG

Este projeto consiste em uma API RESTful para um sistema de blog, desenvolvida com foco em simplicidade, clareza e fácil integração com qualquer tipo de front-end (web, mobile ou desktop). A API foi implementada inteiramente em Node.js com TypeScript, utilizando o framework Express para o gerenciamento de rotas e requisições HTTP.

## Principais Características:

- Estrutura modular e escalável, facilitando manutenção e adição de novas funcionalidades.
- Suporte completo a operações CRUD (Create, Read, Update, Delete) para posts de blog.
- Manipulação de dados via JSON, com rotas organizadas por responsabilidade.
- Middleware para tratamento de erros e autentificação de usuário.
- Código limpo, fortemente tipado com TypeScript, priorizando segurança e robustez.

## Tecnologias utilizadas:

- Node.js — ambiente de execução JavaScript no lado do servidor
- TypeScript — tipagem estática para maior segurança e legibilidade do código
- Express — framework minimalista e flexível para construção de APIs web


## Como usar

### 1. Pré-requisitos
Antes de começar, é necessário garantir que você tenha os seguintes softwares instalados na sua máquina:

- Node.js (versão recomendada LTS)
➡️ https://nodejs.org/en/download
- Git — para clonar o repositório
➡️ https://git-scm.com/downloads

> **ATENÇÃO:**
> Para verificar se estão instalados corretamente, execute no terminal:

Para nodejs:
```bash
node -v
npm -v
```

Para git digite:
```
git --version
```

### 2. Clonando o projeto

Execute o comando abaixo no seu terminal para clonar este repositório:

```bash
git clone https://github.com/LaurenceFluciano/blog-api.git
```

Acesse a pasta do projeto:

```bash
cd blog-api
```

### 3. Instalando dependências

Execute o seguinte comando dentro da pasta do projeto:

```bash
npm install
```

ou, se estiver utilizando outro gerenciador:

```bash
yarn install
```

### 4. Executando o projeto

Primeiramente você deve realizar um build
```
npm run build
```

Após isso você pode rodar o projeto com o seguinte comando:
```
npm run start
```

O servidor estará disponível em:
➡️ http://localhost:3000

> **ATENÇÃO:**
> Antes de iniciar, é necessário configurar uma conexão válida com o banco de dados.
> Crie um arquivo chamado .env na raiz do projeto e defina corretamente a variável de ambiente *URI* ou equivalente, conforme sua configuração.
> Sem isso, o servidor irá apresentar erro ao tentar se conectar ao banco de dados.

### 5. Configurando o Banco de Dados

Se você tentou rodar o projeto e recebeu um erro, isso é absolutamente esperado. Isso ocorre porque ainda não há um banco de dados configurado.

O projeto atualmente oferece suporte exclusivo ao **MongoDB.**

#### Passos para configuração:

1. Acesse o site oficial do MongoDB:
➡️ https://www.mongodb.com/

2. Crie uma conta gratuita.
3. No painel, crie um Cluster gratuito (Shared) — o próprio MongoDB oferece essa opção no plano Free Tier.
4. Após criado, vá em Database → Connect → Drivers → Node.js.
5. Copie a URI de conexão.

Será algo como:
```
mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
``` 
6. Na raiz do projeto **renomeia** o arquivo chamado ".env.example" para ".env"
7. Dentro do arquivo .env no campo *URI* e adicione a URI que você copiou:

Será algo como:
```
URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```
> ATENÇÃO:
> Jamais, em hipótese alguma, compartilhe sua URI de conexão do MongoDB com ninguém.
> Isso inclui não colocar em prints, vídeos, repositórios públicos ou qualquer lugar acessível.
> Sua URI contém seu usuário e senha, e qualquer pessoa que tiver acesso poderá ler, alterar ou até apagar seu banco de dados.

Feito isso, seu projeto estará pronto para funcionar corretamente com conexão ao MongoDB.

