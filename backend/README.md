# Backend — Serviço de Configuração Multi-tenant

Visão geral
------------
Pequeno serviço em NestJS usado em exemplos de teste para demonstrar recuperação de configurações por domínio (multi-tenant). O frontend solicita `/config` e envia o hostname no header `X-Tenant`; o backend responde com a configuração correspondente ao tenant.

Funcionalidade principal
------------------------
- Endpoint: `GET /config`
- Header esperado: `X-Tenant: <hostname>` (ex: `web.tenant1.com`)
- Resposta: objeto JSON com a configuração do tenant ou `null` quando o tenant não existe

Tenants de exemplo
------------------
As configurações de exemplo estão definidas em `src/tenant-config/tenant-config.service.ts`. Para este projeto as entradas incluem, por exemplo:

- `web.tenant1.com` — Tenant 1
- `web.tenant2.com` — Tenant 2

Requisitos
---------
- Node.js (recomendado 18+)
- Yarn (ou npm, adaptando os comandos)

Instalação
---------
No diretório `backend` instale as dependências:

```bash
yarn install
```

Execução
--------
Por padrão o servidor escuta na porta `3000`. Exemplos:

```bash
# desenvolvimento (watch)
yarn start:dev
```

Endpoint usado pelo frontend
---------------------------
O frontend faz uma requisição GET para `http://localhost:3000/config` e envia o hostname no header `X-Tenant`. O backend retorna a configuração correspondente.

Exemplo (curl)
--------------
Simula uma requisição com o header `X-Tenant`:

```bash
curl -v -H "X-Tenant: web.tenant1.com" http://localhost:3000/config
```

Observações de segurança e produção
----------------------------------
- Neste projeto as configurações dos tenants estão hardcoded para fins de demonstração. Em produção, use um banco de dados ou um serviço de gerenciamento de configurações.
- O CORS está habilitado com origem `*` para facilitar testes locais. Ajuste as regras de CORS em `src/main.ts` antes de expor em produção.

Arquivos importantes
--------------------
- `src/main.ts` — bootstrap do NestJS e configuração de CORS
- `src/tenant-config/tenant-config.service.ts` — onde estão as configurações de exemplo
- `src/tenant-config/tenant-config.controller.ts` — controller que expõe `GET /config`
- `src/tenant-middleware/tenant-middleware.middleware.ts` — middleware exemplo que trata/valida o `X-Tenant`
- `src/tenant-middleware/tenant-middleware.middleware.spec.ts` — testes do middleware

