# Frontend (App de teste multi-tenant)

Aplicação frontend mínima em Angular que carrega sua configuração (companyName, dbName, apiUrl, theme) no bootstrap com base no domínio do navegador.

Esta aplicação foi gerada com Angular CLI 20.2.1.

## Como o carregamento de configuração funciona

No bootstrap (arquivo `src/app/app.config.ts`) o app obtém `window.location.hostname` e faz uma requisição GET para o backend em `http://localhost:3000/config`, enviando o hostname no header `x-tenant`.

O backend responde com um JSON contendo a configuração do tenant, que é então armazenada em `ConfigService` e usada pelos componentes.

Resumo do fluxo:

1. Browser abre a app (ex: `http://tenant1.com:4200`)
2. App coleta `window.location.hostname` (ex: `tenant1.com`)
3. Faz GET `http://localhost:3000/config` com header `x-tenant: tenant1.com`
4. Backend retorna a configuração específica do tenant
5. App inicializa usando a configuração retornada

## Instalação e execução

Instale dependências e inicie a aplicação:

```bash
# no diretório frontend
yarn install

# iniciar em 0.0.0.0:4200 (exposto para redes locais)
yarn start:dev
```

O script `start` foi configurado para rodar em `--host 0.0.0.0 --port 4200` e permitir hosts comuns usados nos exemplos.

## Testando o fluxo localmente

1. Inicie o backend (veja `backend/README.md`) — por padrão em `http://localhost:3000`.
2. Inicie o frontend: `yarn start:dev`.

3. Abra o navegador apontando para um hostname que represente o tenant. Exemplos locais:

- Use `/etc/hosts` para mapear domínios de teste para `127.0.0.1`:

	127.0.0.1 web.tenant1.com
	127.0.0.1 web.tenant2.com

- Acesse `http://web.tenant1.com:4200` e o frontend enviará `x-tenant: web.tenant1.com` para o backend.

Exemplo de verificação com curl (simulando o header):

```bash
curl -H "x-tenant: web.tenant1.com" http://localhost:3000/config
```

## Scripts úteis

- `yarn start` — inicia o dev server (4200)

## Observações e limitações

- O backend neste repositório usa configurações hardcoded para demonstração. Em produção, use um armazenamento seguro (DB ou serviço de configuração).
- O CORS no backend está configurado para permitir todos os origens para facilitar testes locais.

## Recursos

- Arquivo de inicialização que carrega configuração: `src/app/app.config.ts`
- Serviço que armazena a configuração: `src/app/services/config.service.ts`

