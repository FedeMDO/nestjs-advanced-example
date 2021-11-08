Homelike Challenge
Build with NestJS (Typescript), MongoDB, Docker (Compose), JWT Auth.

## Description
Resolution of Homelike's challenge with a few tasks.

Scope (Time available: 3 days):
- Implementation of user and apartment modules (including services, controllers, schemas, dtos, etc) [DONE]
- Implementation of a cool apartment filter [DONE]
- Auth with JWT [DONE]
- Testing [PARTIAL] // need to extend e2e

This time I don't think I will have time to implement the GraphQL part. I don't have working experience with it (even if I'm eager to learn it).

# Docker (docker-compose) needed in order to run app and mongodb

## Installation
```bash
$ npm install
# If you get an error, try with adding --force (possibly a passport peer deps error)
$ npm install --force
```

## Running the app
```bash
# dockerized version (mongodb and node app)
$ npm run init
```

## Test
The testing scopes auth flow and e2e. We're not testing mongoose model functions like find, findOne, etc.

Unit tests are mocked (if they need access to db) so you can run them without initializing the cointainers

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run build && docker-compose up -d && npm run test:e2e

# test coverage
$ npm run test:cov
```

For e2e testing, be sure to first run ```docker-compose up``` or ```npm run init``` commands in order to have mongodb locally deployed and mapped to your port 27017

## Documentation
Check /docs folder to find a simple diagram showing the schemas design

### OpenAPI
I have included swagger OpenAPI's documentation that you will find accessing to ```localhost:8080/api``` on your Browser. You can easily import a collection of request to your preferred HTTP client tool like Postman or Insomnia by accessing to ```localhost:8080/api-json``` that gives you a raw json representing the collection itself.

## Comments
Why NestJS? It's an awesome Typescript framework inspired on Angular. It has lot of built-ins and wrappers of mongoose, passport, jwt as well as 

I assume an user can be both a landlord (apartment's owner) and a tenant at the same time (that's why user can mark apartments as favorites). 
(I asked something related to this by email but it was already out of working hours)

A "test" database is created by default in mongodb

There are validation pipes, so we can validate client request parameters. For example if you want to register a user, you need a well-formed email, etc.

In order to transform the query parameters on the request "Get all apartments with filters", we use a custom validation/transform pipe. 

This way, cityName and countryName can be either a simple string or a comma-separated string with many cities or countries. We automatically parse it into an array of strings.

User indexing is made by the typical mongodb ObjectId. However, username and email are uniques.