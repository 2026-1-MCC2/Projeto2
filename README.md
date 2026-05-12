```sh
Utilize o site <https://www.toptal.com/developers/gitignore> para gerar seu arquivo gitignore e apague este campo.

Veja tutoriais do PI.
```

# FECAP - Fundação de Comércio Álvares Penteado

<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# NutConnect

## Grupo AlimConnect

## Integrantes: <a href="https://www.linkedin.com/in/victorbarq/">Arthur Daher Franceschelli</a>, <a href="https://www.linkedin.com/in/victorbarq/">Claudia Dias Calado Bovenzo</a>, <a href="https://www.linkedin.com/in/victorbarq/">Eliaquim Marcelino Silva</a>, <a href="https://www.linkedin.com/in/victorbarq/">Fernanda Figueiredo Simões</a>, <a href="https://www.linkedin.com/in/victorbarq/">Luiz Miguel de Toledo</a>

## Professores Orientadores: <a href="https://www.linkedin.com/in/victorbarq/">Cristina Machado Correa Leite</a>, <a href="https://www.linkedin.com/in/victorbarq/">David De Oliveira Lemes</a>, <a href="https://www.linkedin.com/in/victorbarq/">Francisco de Souza Escobar</a>, <a href="https://www.linkedin.com/in/victorbarq/">Jesus De Lisboa Gomes</a>, <a href="https://www.linkedin.com/in/victorbarq/">Katia Milani Lara Bossi</a>

## Descrição

<p align="center">
<img src="frontend/assets/Imagem__Logo_AlimConnect.png" alt="Logotipo da AlimConnct" border="0">
  Image by Gemini
</p>


O AlimConnect é um projeto interdisciplinar desenvolvido por alunos de Ciência da Computação da FECAP, especializado na criação de plataformas digitais voltadas à conexão entre fornecedores e consumidores, oferecendo soluções personalizadas para empresas que desejam expandir sua presença online.

Neste projeto, a AlimConnect foi contratada pela Mr. Nut para desenvolver uma plataforma digital com foco em marketplace. O objetivo é criar um ambiente intuitivo e eficiente, onde fornecedores possam disponibilizar seus produtos e usuários possam navegar, selecionar e favorita de forma prática.

A solução busca otimizar a experiência do usuário, facilitar a gestão de produtos por parte dos fornecedores e fortalecer a presença digital da empresa contratante.
<br><br>

## 🛠 Estrutura de massas

```
Projeto2/
├── 🗄️ banco-de-dados                                  # Scripts de criação das tabelas MySQL                                   
├── 📂 documentos
│   ├── 📂 entrega-1
│   │   ├── 📁 Cálculo 2
│   │   ├── 📁 Desenvolvimento Web Full Stack
│   │   ├── 📁 Gestão Empresarial e Dinâmica das Organizações
│   │   ├── 📁 Projeto Interdisciplinar Programação Web
│   │   └── 📁 Projeto em Banco de Dados
│   ├── 📂 entrega-2
│   │   ├── 📁 Cálculo 2
│   │   ├── 📁 Desenvolvimento Web Full Stack
│   │   ├── 📁 Gestão Empresarial e Dinâmica das Organizações
│   │   ├── 📁 Projeto Interdisciplinar Programação Web
│   │   └── 📁 Projeto em Banco de Dados
│   ├── 📂 imagem-documentos
│   │   └── 📜 Banner_FECAP_CCOMP2S_ALIMCONNECT.pptx.pdf
│   ├── 📄 Documento - Projeto de Extensão - COM Empresa.pdf
│   └── 📄 Documento de Requisitos.pdf
│
├── 📂 back-end
│   ├── 📂 src
│   │   ├── 📂 controllers
│   │   │   ├── 📄 authController.js                 # Regras de login, logout e reset de senha
│   │   │   ├── 📄 productController.js              # Regras de listagem e criação de produtos
│   │   │   └── 📄 userController.js                 # CRUD e gerenciamento de contas de usuários
│   │   ├── 📂 middlewares
│   │   │   └── 📄 authMiddleware.js                 # Filtro de segurança e validação de tokens
│   │   ├── 📂 services
│   │   │   └── 📄 tokenService.js                   # Gerador e validador de chaves JWT
│   │   ├── 📄 app.js                                # Configuração do Express, CORS e rotas
│   │   ├── 📄 db.js                                 # Conexão e pooling com o banco MySQL
│   │   ├── 📄 routes.js                             # Definição dos caminhos/endpoints da API
│   │   ├── 📄 server.js                             # Inicialização do servidor HTTP
│   │   └── 📄 uploadConfig.js                       # Configuração do Multer para upload de arquivos
│   ├── 📂 uploads                                   # Armazenamento local das imagens enviadas
│   ├── 📄 package.json                              # Dependências do projeto e scripts de execução
│   └── 📄 package-lock.json                         # Histórico de versões exatas das dependências
│
├── 📂 front-end
│   ├── 📂 assets                                    # Imagens, logotipos e ícones do projeto
│   ├── 📄 contato.html                              # Página de contato com integração WhatsApp
│   ├── 📄 favoritos.html                            # Exibição dos produtos salvos no LocalStorage
│   ├── 📄 index.html                                # Vitrine principal, buscas e filtros
│   ├── 📄 produto.html                              # Detalhes do produto selecionado
│   ├── 📄 quem-somos.html                           # Página institucional da AlimConnect
│   ├── 📄 script.js                                 # Lógica JS geral e interações da interface
│   └── 📄 style.css                                 # Estilização visual global (Tailwind/CSS)
│
├── 📄 .gitignore                                    # Arquivos ignorados pelo Git (ex: node_modules, .env)
└── 📄 README.md                                     # Documentação e guia de execução do projeto
```
### 📝 Descrição das Pastas:

- **`Documentos/`**: Centraliza a documentação do projeto e as entregas das disciplinas do semestre, organizadas cronologicamente.
- **`Backend/`**: Contém o código-fonte da API REST desenvolvida em Node.js e Express, além de toda a lógica de servidor e arquivos internos.
-  **`Frontend/`**: Reúne todos os arquivos de interface, componentes e recursos visuais do projeto..
- **`Readme.md`**: Este arquivo que você está lendo agora, contendo informações completas sobre o projeto.
  

## 🗄 Banco de Dados: Arquivo Final

Abaixo, disponibilizamos o link para a modelagem do banco de dados. Vale ressaltar que a estrutura foi totalmente concluída e integrada ao projeto, com todas as informações detalhadas e atualizadas já disponíveis na pasta "Banco de Dados".

* [Modelagem do Banco de Dados](./Documentos/Entrega%201/Projeto%20em%20Banco%20de%20Dados/README.md)

## 💻 Configuração para Desenvolvimento 

Postman (para testar as rotas)

Node.js (v18 ou superior)

MySQL Server (v8.0 ou superior)

## 🛠 Instalação 

  
1.   Clone o repositório:
   
     https://github.com/2026-1-MCC2/Projeto2.git
   
2.   Crie o banco de dados: 

    banco_de_dados/banco.mysql.sql

3.   Instale as dependencias:

    cd back
     
    npm install express mysql2 dotenv multer bcrypt cors

    node src/server.js

4. ir em na pasta /Dadosenv e achar o /env.info
   
    cp.env.info.env
     
5.  Configure as variaveis de ambiente:

    MYSQL_HOST=localhost
    
    MYSQL_USER=root
    
    MYSQL_PASSWORD=
         
    MYSQL_DB=alimconnect_db
    

6.  Inicie o servidor

     npm run dev

     O servidor esta rodando em:   http://localhost:3000/api/users/:id
   
Rotas da API

  Método    Rota           Descrição                              StatusEsperado  

    POST	    /api/users	     Criar um novo usuário no AlimConnect	  201

    GET	      /api/users	     Listar todos os usuários cadastrados	  200

    GET	      /api/users/:id	 Buscar um usuário específico por ID	  200

    PUT	      /api/users/:id	 Atualizar dados de um usuário existente	200

    DELETE	  /api/users/:id	 Deletar usuário do sistema por ID	    200

EXEMPLO DE PUT
  { 
  
    "name": "Marisa Silva"
  
    "email": "maria.teste@email.com

    "role": "admin"
  
    "descripiton": "Agora sou adiministrador da AlimConnect"
  
  }   
  
Banco de Dados
1. Abra o MySQL
2. Execute o script SQL abaixo
3. Certifique-se de que o nome do banco corresponde ao arquivo `.env`

    O banco alimconnect_db possui as seguintes tabelas:

    Usuarios — Dados base de todos os usuários (Nome, Email, Senha)

    Pedidos — Registros dos pedidos realizados, vinculados aos usuários
  
    Produtos — Catálogo de produtos com descrição e preços

    Itens_Pedidos — Tabela intermediária que detalha os produtos de cada pedido (Quantidade e Valor)
  
## 📋 Licença/Licença
Utilize o link <https://chooser-beta.creativecommons.org/> para fazer uma licença CC BY 4.0.

## 🎓 Referências 

Aqui estão as referências usadas no projeto.

1. <https://github.com/iuricode/readme-template>
2. <https://github.com/gabrieldejesus/readme-model>
3. <https://chooser-beta.creativecommons.org/>
4. <https://www.toptal.com/developers/gitignore>
