# Listen-2-Learn API implementation

## Description

This is an example of vertical slicing architecture for rest api using nodejs [https://markhneedham.com/blog/2012/02/20/coding-packaging-by-vertical-slice/](https://markhneedham.com/blog/2012/02/20/coding-packaging-by-vertical-slice/). Comparing to horizontal slicing (layered architecture) it has less model code gap - easy to understand modeled domain. Implementation also aligned with rules of Clean Architecture by Uncle Bob [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## Development

How to run locally (in dev mode):

1. To prepare docker run `npm run docker:build`
2. To start app `npm run docker:run`
3. API server is available on `http://localhost:8080/`

Migrations and seed runs automatically

How to run tests in separate docker:

1. Prepare docker image `npm run docker:test:build`
2. Run api tests in separate docker `npm run docker:test`

## API Docs

Here is Postman collection to work with API locally:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/f59aee4039af3634b7e7)
