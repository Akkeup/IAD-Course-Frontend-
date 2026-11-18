# Контрольные вопросы

## Redux Toolkit

`reducer` описывает переходы состояния, `store` хранит единое состояние и
подключает middleware, а `middleware` перехватывает dispatch до reducer.
`createAsyncThunk` выполняет асинхронный запрос и автоматически создаёт
состояния `pending`, `fulfilled`, `rejected`.

## Axios

Axios — HTTP-клиент для браузера. В проекте он настроен с
`baseURL: /api` и `withCredentials: true`; поэтому browser отправляет cookie,
а Vite proxy скрывает CORS между frontend, backend и MinIO.

## Local Storage

`localStorage` хранит данные в браузере между перезагрузками, но JWT в этом
проекте туда не помещается: сессия находится в HttpOnly cookie. После F5 Redux
сбрасывается в гостя, а cookie остаётся в Application для проверки Postman.

## CORS, reverse proxy, BFF и GraphQL

CORS — политика браузера для разных origin. Reverse proxy отправляет запросы
через origin frontend и тем самым устраняет необходимость прямого CORS для
браузера. BFF — отдельный backend-for-frontend, который адаптирует backend
под конкретный UI. GraphQL отдаёт выбранное клиентом поле через единую схему;
данная работа использует REST, поэтому GraphQL не добавляется.

## Next.js и SSG

Next.js — React-фреймворк с routing и серверными режимами. SSG заранее
генерирует HTML статических страниц. Текущая работа — Vite SPA с динамическими
REST-запросами, поэтому SSG здесь не используется.

## FSD

Feature-Sliced Design разделяет проект на `shared`, `entities`, `features`,
`widgets`, `pages`, `app`. В текущем небольшом учебном проекте слои выражены
упрощённо: `api`, `store`, `components`, `pages`; доменная сущность — звезда.
