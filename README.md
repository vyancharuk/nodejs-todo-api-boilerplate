# Node.js Typescript Template Project

![node](https://img.shields.io/badge/node-v14.21.3--v20.15.1-brightgreen) ![npm](https://img.shields.io/badge/npm-v6.14.18-blue)

## Description

This project is a simple Node.js boilerplate using TypeScript and Docker. It demonstrates vertical slicing architecture for a REST API, as detailed here: [https://markhneedham.com/blog/2012/02/20/coding-packaging-by-vertical-slice/](https://markhneedham.com/blog/2012/02/20/coding-packaging-by-vertical-slice/). Unlike horizontal slicing (layered architecture), vertical slicing reduces the model code gap, making the modeled domain easier to understand. The implementation also follows the principles of Clean Architecture by Uncle Bob: [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

The application provides APIs for users to view, create, update, and delete todos (CRUD operations)

## Features

- Vertical slicing architecture based on **DDD & MVC** principles
- Service input validation using **ZOD**
- Decoupling application components through dependency injection using **InversifyJS**
- Integration and E2E testing with **Supertest**
- **Docker-compose** simplifies multi-service setup, running application, DB, and Redis in isolated docker containers easily
- Simple DB transaction management with **Knex**
- Multi-layer trace ID support for logging with **winston**
- Support graceful shutdown for the **express.js** server
- Auto-reload on save using **ts-node-dev**


### Application structure

```bash
todo-api
├─ package.json
├─ src
│  ├─modules (domain components)
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

### Logging and tracing

The application uses the `winston` logger for effective logging and implements cross-layer trace IDs in the winston wrapper output logic. As a result, logs related to the same request but from different layers (service, repository, controller) are outputted with the same trace ID without any extra implementation. 

``Console Output``:

    info 07/21 15:26:16:742 [928aa440-4775-11ef-a88a-7b1736b24e71] GetTodos:execute
    info 07/21 15:26:16:743 [928aa440-4775-11ef-a88a-7b1736b24e71] TodosRepository:findAll
    info 07/21 15:26:16:806 [928aa440-4775-11ef-a88a-7b1736b24e71] createController:completed


## Before install

Please make sure that you have docker installed [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

## Development

How to run locally (in dev mode):

1. Copy `.env.sample` and rename it to `.env`, providing the appropriate environment variable values. Some of the variables are defined in the docker-compose file
2. Install dependencies locally `npm i`
3. Start the app using `npm run docker:run`
4. By default, the API server is available at `http://localhost:8080/`

Migrations and seed run automatically

How to run tests in separate docker containers locally:

1. Install dependencies locally `npm i`
2. Run API tests in separate docker containers `npm run docker:test`

## API Docs

Here is Postman collection to work with API locally:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/429508-4b29a48c-b45d-4d09-912f-83090fd70b5e?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D429508-4b29a48c-b45d-4d09-912f-83090fd70b5e%26entityType%3Dcollection%26workspaceId%3Dcb523e15-e316-4367-a52b-6caab455c64a)


