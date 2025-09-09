# Projeto Multi-tenant (exemplos frontend + backend)

Visão geral
------------
Este repositório contém um exemplo mínimo de aplicação multi-tenant composto por duas partes:

- `backend/` — serviço em NestJS que expõe um endpoint para recuperar a configuração de um tenant (com base no host recebido via header `X-Tenant`).
- `frontend/` — aplicação Angular que, no bootstrap, solicita a configuração ao backend enviando o hostname atual no header `X-Tenant` e inicializa a aplicação conforme a configuração do tenant.

Objetivo
--------
O objetivo é demonstrar, de forma simples e didática, como uma aplicação pode carregar configurações por domínio (multi-tenant). O exemplo mostra:

- como o frontend determina o tenant a partir de `window.location.hostname`;
- como o frontend solicita a configuração do tenant ao backend usando um header HTTP;
- como o backend identifica e devolve a configuração apropriada (ou `null` se não existir).

Quando usar este repositório
-----------------------------
Use este repositório para aprendizado, experimentos locais ou como ponto de partida para implementar uma estratégia multi-tenant em projetos maiores. As configurações dos tenants aqui são hardcoded e servem apenas para demonstração.

Arquitetura e fluxo
-------------------
1. O usuário abre a aplicação frontend em um domínio que representa um tenant (ex: `web.tenant1.com`).
2. O frontend lê `window.location.hostname` e faz uma requisição GET para `http://localhost:3000/config` com o header `X-Tenant: <hostname>`.
3. O backend (NestJS) recebe o header, procura a configuração do tenant e retorna um JSON com os dados de configuração ou `null` se o tenant não for encontrado.
4. O frontend inicializa usando a configuração recebida (companyName, dbName, apiUrl, theme, etc.).

Como rodar (resumo rápido)
-------------------------
Pré-requisitos: Node.js (recomendado 18+), yarn ou npm.

1) Backend

```bash
cd backend
yarn install
yarn start:dev
```

Por padrão o backend escuta em `http://localhost:3000`.

2) Frontend

```bash
cd frontend
yarn install
yarn start:dev
```

O frontend é servido em `http://0.0.0.0:4200` (conforme configuração do projeto) — use mapeamento em `/etc/hosts` para simular domínios de tenant locais.

- Use `/etc/hosts` para mapear domínios de teste para `127.0.0.1`:

```sh
127.0.0.1 web.tenant1.com
127.0.0.1 web.tenant2.com
```

Testando o fluxo com curl
------------------------
Simule uma chamada ao backend enviando o header `X-Tenant`:

```bash
curl -v -H "X-Tenant: web.tenant1.com" http://localhost:3000/config
```

Arquivos importantes
--------------------
- `backend/src/tenant-config/tenant-config.service.ts` — onde estão as configurações de exemplo dos tenants.
- `backend/src/tenant-config/tenant-config.controller.ts` — controller que expõe o endpoint `GET /config`.
- `backend/src/tenant-middleware/tenant-middleware.middleware.ts` — middleware de exemplo que pode validar/tratar `X-Tenant`.
- `frontend/src/app/app.config.ts` — rotina de bootstrap que busca a configuração do tenant.
- `frontend/src/app/services/config.service.ts` — serviço que armazena e fornece a configuração para o app.

Boas práticas e notas
---------------------
- Em produção não guarde configurações sensíveis em código: use um banco de dados ou serviço de configuração seguro.
- Configure CORS e políticas de segurança apropriadas no backend antes de expor o serviço.
- Este projeto pretende ser fácil de entender; para casos reais considere cache, autenticação, validação e monitoramento.

Executando com Docker Compose
----------------------------
Arquivos relacionados ao Docker neste repositório:

- `backend/Dockerfile` - build multi-stage da API NestJS.
- `frontend/Dockerfile` - build do Angular e servidor nginx.
- `compose.yml` - orquestra os serviços frontend e backend.

Como executar com Docker Compose:

1. Construir e iniciar contêineres:

```bash
docker compose up --build
```

2. Acesse:

- Frontend: http://web.tenant1.com:4200
- Frontend: http://web.tenant2.com:4200
- Backend: http://localhost:3000

Notas sobre os containers:

- Os Dockerfiles usam Node 22 (alpine). Ajuste se necessário.
- O `frontend` é servido por nginx na porta 80 do container e mapeado para 4200 local.

Estrutura do repositório
------------------------
```
multidominios/
├─ backend/    # NestJS — serviço de configuração por tenant
├─ frontend/   # Angular — app que carrega config por hostname
```

Contribuindo
------------
Pull requests e sugestões são bem-vindos. Para mudanças locais, siga o fluxo comum: crie uma branch e abra um PR descrevendo a motivação.

