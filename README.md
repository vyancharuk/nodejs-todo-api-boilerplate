# Todos API boilerplate project

## Description

This is an example of vertical slicing architecture for rest api using nodejs and typescript [https://markhneedham.com/blog/2012/02/20/coding-packaging-by-vertical-slice/](https://markhneedham.com/blog/2012/02/20/coding-packaging-by-vertical-slice/). Comparing to horizontal slicing (layered architecture) it has less model code gap - easy to understand modeled domain. Implementation also aligned with rules of Clean Architecture by Uncle Bob [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

Application provides API for user to view, create todos with image attachments,

### Application structure

```bash
todo-api
├─ package.json
├─ src
│  ├─modules (components)
│  │ ├─ todos
│  │ │ ├─ tests
│  │ │ ├─ repository
│  │ │ ├─ routes
│  │ │ ├─ controllers
│  │ │ ├─ *.service (business logic implementation)
│  ├─ users
│  ├─ ...
│  │
├─ infra (generic cross-component functionality)
│  ├─ data (migrations, seeds)
│  ├─ integrations (services responsible for integrations with 3rd party services - belong to repository layer)
│  ├─ loaders
│  ├─ middlewares
```

## Before install

Please make sure that you have docker installed [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

## Development

How to run locally (in dev mode):

1. Copy `.env.sample` and rename it to `.env`, providing appropriate env var values. Part of the vars are defined in docker-compose file
2. Install dependencies locally `npm i`
3. To start app
   `npm run docker:run`
4. By default API server is available on `http://localhost:8080/`

Migrations and seed runs automatically

How to run tests in separate docker locally:

1. Install dependencies locally `npm i`
2. Run api tests in separate docker `npm run docker:test`

## API Docs

Here is Postman collection to work with API locally:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/f59aee4039af3634b7e7)
