# SR2.ru

Стек: NextJS, Drizzle, Docker, Postgres

Для локальной разработки используется контейнеризированный PostrgreSQL

```sh
docker-compose up -d
```

Инициализация базы, сидинг

```sh
npm run migrate
npm run seed
```

При обновлении моделей

```sh
npm run migrations:generate
```

Часто при изменении структуры индексов требуется откат миграций

```sh
npm run migrations:drop
```

Проверка консистентности миграций

```sh
npm run migrations:up
```

Локальный dev-сервер

```sh
npm run dev
```
