# Andromeda Stars — лабораторная работа №6

Frontend интерфейса пользователя на React + TypeScript + Vite. Предметная
область — каталог звёзд Андромеды: карточка звезды является услугой.

## Запуск

```sh
npm ci
npm run dev
```

Frontend работает на `http://127.0.0.1:5173`. В dev-режиме Vite проксирует:

- `/api` → `http://127.0.0.1:8080`;
- `/s3` → `http://127.0.0.1:9000` (MinIO).

Backend и инфраструктура находятся в соседнем `IAD-Course-Backend-`. Его
локальный auth-контракт использует HttpOnly cookie `andromeda_session` с JWT.
GET списка и ленты доступны гостю; создание, публикация, лайк и удаление
требуют cookie авторизованного пользователя.

## Реализованные требования лабораторной №6

- Redux Toolkit store с `auth` и `services` slices.
- Redux-фильтр по `distance_kpc`; выход сбрасывает фильтры.
- Axios с `withCredentials: true`.
- Redux Toolkit `createAsyncThunk` для домена звёзд.
- Ручные Axios-запросы login/logout без thunk и codegen.
- Mock fallback для гостя при недоступном backend.
- Страница входа и переключение `Вход`/`Выход`.
- Страница создания draft с загрузкой image/video и последующей публикацией.
- Кнопки лайка, отмены лайка и удаления собственной услуги.
- Loading overlay, блокирующий интерфейс во время запроса.
- Vite proxy для backend и MinIO.
- OpenAPI-контракт `openapi.yaml` и сгенерированный Axios-клиент
  `src/api/generated`.
- Диаграмма прецедентов: `docs/react-use-cases.drawio`.
- Ответы на контрольные вопросы: `docs/lab6-control-questions.md`.

## API codegen

Генерация клиента выполняется командой:

```sh
npm run api:generate
```

Она создаёт клиент из `openapi.yaml` через
`openapi-typescript-codegen --client axios`. Сгенерированный
`DefaultService` используется в `src/api/services.ts` и thunk-операциях.

## Mock fallback

`src/api/services.ts` сначала вызывает generated API. Если backend недоступен
и пользователь является гостем, список и лента берутся из
`src/data/stars.ts`. Для авторизованного пользователя ошибка backend не
подменяется mock-данными.

## Auth и F5

После login backend устанавливает HttpOnly JWT-cookie. Redux хранит интерфейсное
состояние пользователя только в памяти. Поэтому после F5 Redux снова показывает
гостя, а cookie остаётся видимой во вкладке Application. Для демонстрации
запросов в Postman/Insomnia cookie можно скопировать из Application.

## Порядок демонстрации

1. Две гостевые mock-страницы без backend: лента и плитка.
2. Четыре страницы с backend: плитка, лента, карточка и добавление.
3. Изменение услуги в БД через создание/публикацию или удаление и проверка во frontend.
4. Login, F5: Redux — гость, cookie/JWT — остаётся в Application.
5. Запрос плитки в Postman/Insomnia с cookie из Application.
6. Redux store, reducer, middleware и generated Axios client.
7. Thunk-методы создания, списка, удаления и лайка с тематическими названиями.
8. Network: `/api/...` через proxy и `/s3/...` для MinIO-медиа.

## Проверки

```sh
npm test
npm run build
cd ../IAD-Course-Backend- && cargo check --offline
```

Тесты frontend проверяют гостевую фильтрацию, fallback-медиа, маршруты и
переключение ленты. Production-сборка проверяет TypeScript и Vite.

Расчёт аппаратных требований из предыдущей лабораторной сохранён отдельно:
[PDF с формулами и исходными допущениями](output/pdf/lab5-hardware-requirements.pdf).
В нём учтены RPS, число ядер, ОП, поля таблиц и объекты S3 за пять лет.

Изменения оставляются локально: push и другие операции с удалённым Git не
выполняются.
