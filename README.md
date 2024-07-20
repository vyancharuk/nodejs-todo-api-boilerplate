# Node.js Typescript Template Project

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) ![node](https://img.shields.io/badge/node-v14.21.3--v20.15.1-brightgreen) ![npm](https://img.shields.io/badge/npm-v6.14.18-blue)

## Description

This project is a simple Node.js boilerplate using TypeScript and Docker. It demonstrates vertical slicing architecture for a REST API, as detailed here: [https://markhneedham.com/blog/2012/02/20/coding-packaging-by-vertical-slice/](https://markhneedham.com/blog/2012/02/20/coding-packaging-by-vertical-slice/). Unlike horizontal slicing (layered architecture), vertical slicing reduces the model code gap, making the modeled domain easier to understand. The implementation also follows the principles of Clean Architecture by Uncle Bob: [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

The application provides APIs for users to view, create, update, and delete todos (CRUD operations)

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

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/f59aee4039af3634b7e7)
