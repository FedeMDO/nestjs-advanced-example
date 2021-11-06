Homelike Challenge
Build with NestJS (Typescript), MongoDB, Docker (Compose), JWT Auth.

## Description
Resolution of Homelike's challenge with a few tasks.

Scope (Time available: 3 days):
- Implementation of user and apartment modules (including services, controllers, schemas, dtos, etc) [DONE]
- Implementation of a cool apartment filter [DONE]
- Auth with JWT [TODO]
- Testing [PARTIAL] // need mocks

This time I don't think I will have time to implement the GraphQL part. I don't have working experience with it (even if I'm eager to learn it).

## Installation
```bash
$ npm install
```

## Running the app
```bash
# dockerized version (mongodb and node app)
$ npm run init
```

## Test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Comments
I assume an user can be both a landlord (apartment's owner) and a tenant at the same time. (I asked something related to this by email but it was already out of working hours)
Check /docs folder to find a simple diagram showing the design

A "test" database is created by default