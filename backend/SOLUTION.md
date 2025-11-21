# Solution

Hi.

Main intention of this solution is to be minimal yet show the best practices for production ready project.
In real life I would use Nest.js as a framework which provides many features out of the box, but for the sake of the test task, I used express.

## Start

I've updated `docker-compose.yml`:

- Added test DB instance that keeps all the data **in memory** so tests run super fast and this setup is compatible with CI/CD.
- Added indexes into `db/init.sql` as I believe adding indexes is a part of the task.

⚠️ To make sure that you don't run old versions of containers during testing, please, rebuild containers by these two commands:

   ```sh
   # down containers and remove volumes
   docker compose down -v

   # up containers and force rebuilding
   docker compose up --build
   ```

After rebuilding once, you may start as usual next time `docker compose up`.

To run tests inside docker just run `docker exec backend_tech_test yarn test` (after `docker compose up`).

If you have any problems running docker compose after my update, please, recreate containers completely from scratch by running this heavy command `docker compose down -v --rmi all` and then `docker compose up`.

## API Shape

For shaping API it's important to understand domain, as I didn't have ability to ask questions about domain, I've implemented 2 versions just in case.

### Version 1

In the first approach I assume that every market is identified by its name (ex: `Token 01`) and it could be on the multiple chains, even though test data doesn't have such examples.

For such case I've implemented endpoints that can return TVL and liquidity by any combination of `chainId` and `marketName`:

- `/tvl?chainId=1&marketName=Token 01` - get TVL with optional filters by `chainId` and `marketName`.
- `/liquidity?chainId=1&marketName=Token 01` - get liquidity with optional filters by `chainId` and `marketName`.

NOTE:

- As task required creating `/tvl` endpoint that is not suitable for returning liquidity inside, I've created a separate endpoint for liquidity.

### Version 2

In the second version I assume that requirement "Let the client fetch the TVL or liquidity of a single market" means that each market is actually unique per chain, and market name itself could have duplicates as tokens in blockchain may have duplicate names.

To show how I would implement it in such a case, I've created another set of endpoints:

- `/markets/:marketId` - get market details with both `tvl` and `liquidity` as it's fast to calculated per market
- `/markets` - get a list of markets, because otherwise we don't know `marketId` for getting individual markets. I've created a simple pagination without cursor, suggesting that we don't have too many markets and simple pagination will work fast enough.
  - This endpoint supports the same filters `?chainId=1&marketName=Token 01` which is a good practice to provide.

NOTE:

- In this case we actually don't need filter by `marketName` inside `/tvl` and `/liquidity` endpoints and it has to be removed, but I keep these filters in case **Version 1** is more suitable for domain.

## Notes

- I define Chain list as enum, which helps for validation because I believe the number of supported chains rarely changes, so it's ok to rebuild code in case we add or remove chain support. Also, code often need to have different logic for chains with different architecture like Solana and BSC. So we could write in code something like `if (chain === Chan.BSC)`.

## Features

- App is strictly typed without usage of `any`, and with `zod` library which provides types for checking and validations during runtime.
  - All the requests are typed by request DTOs and strictly validated using `zod`.
  - All the responses are also typed by response DTOs for visibility during development, and validated during tests.
- App follows dependency injection architecture which makes it easy to test.
- Typed config
  - Config automatically check env vars so we never forget to pass them, to avoid unexpected errors in runtime.
  - Config automatically transforms types of values (for example string '8181' to number 8181).
  - Config is typed so it's safe to use it the code, and `process.env` is prohibited to use via eslint.
- Tests
  - Integration tests cover parts which require interaction with DB, while unit tests check simple parts.
  - Tests cover the whole code without duplication in unit and integration test, so it's easier to support.
- Eslint & prettier for ensuring good practices and consistent code style.

## Todo

These improvements which would be nice to do, but I kept out of scope for now because of limit time:

- Config migrations using TypeORM and move DB creation and data seeding form `db/init.sql` to TypeORM migrations.
- Update `Dockerfile` to use `yarn` instead of `npm` as `yarn` is mentioned as `packageManager` inside `package.json`.
  - Also create separate `Dockerfile` for production deployment with multilayer caching.
- Create a generic DTO for a list response so that `MarketsListResponse` would extend it and other list endpoints could follow the same shape.
- Create middleware to log request start and response end with status and time request took.
- Add request id which is supported by `pino` logger into all the logs and response headers for tracking.
- For `bigint` columns use `bigint` or `BigNumber` type inside code instead of `string`. That would make code more robust. This requires us implementing transformers for TypeORM and for DTOs.
- Create README which would describe how to setup project, how to deploy, tech stack and some best practices to follow for future developers.
