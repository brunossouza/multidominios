# Executando com Docker Compose

Arquivos adicionados:

- `backend/Dockerfile` - build multi-stage da API NestJS.
- `frontend/Dockerfile` - build do Angular e servidor nginx.
- `docker-compose.yml` - orquestra os serviços frontend e backend.

Como executar:

1. Construir e iniciar contêineres:

```bash
docker-compose up --build
```

2. Acesse:

- Frontend: http://localhost:4200
- Backend: http://localhost:3000

Notas:

- Os Dockerfiles usam Node 20 (alpine). Ajuste se necessário.
- O `frontend` é servido por nginx na porta 80 do container e mapeado para 4200 local.
- Os volumes montados são somente leitura para facilitar iteração; remova se precisar de hot-reload.
