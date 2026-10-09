# node-ship-api

Small **Express** API shaped like something you would actually ship: health check, login, layered folders, Docker, and CI.

Not a mega-starter. One request path you can read in a few minutes.

## Architecture

```
HTTP
  routes/       parse request, status codes
    services/   business rules
    middleware/ auth + errors
config          env with safe local defaults
```

| Method | Path | Auth | Result |
|---|---|---|---|
| GET | `/health` | no | liveness JSON |
| POST | `/auth/login` | no | JWT |
| GET | `/auth/me` | Bearer | current user |

Demo login (override with env): `demo` / `demo-pass`.

## Run

```bash
npm install
npm test
npm start
# http://localhost:3000/health
```

```bash
docker compose up --build
```

Copy `.env.example` in production and set `JWT_SECRET`.

## Layout choice

Routes parse HTTP. Services hold the rules. Middleware handles auth and errors. Retries and a database are left out so the path from request to response stays readable.

Set `JWT_SECRET` from the environment before any deploy. The demo account is `demo` / `demo-pass` unless that environment overrides it.

## License

MIT © Song Xiangrong
