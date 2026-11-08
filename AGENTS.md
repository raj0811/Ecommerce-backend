# Project instructions

## Purpose and scope

This repository is the NestJS and TypeScript backend for the Alpha Male e-commerce platform. Preserve its existing NestJS module structure, REST API contracts, MongoDB/Mongoose persistence model, and integrations unless the task explicitly asks to change them. Before editing, inspect the relevant controller, service, schema, module, and tests so changes follow the code that actually exists.

The application source is under `src/`; Jest end-to-end tests/configuration are under `test/`. The application is bootstrapped in `src/main.ts` and assembled in `src/app.module.ts`. Do not treat README examples or aspirational architecture descriptions as proof that an endpoint or feature exists; verify implementation in source.

## Architecture and module structure

The application is organized as feature modules. Existing modules include `user`, `admin`, `customer`, `product`, `cart`, `payment`, `order`, `ship-rocket`, `support-ticket`, `stats`, `landin-page`, `s3-bucket`, `mailer`, and `whatsapp`, plus `database`. Preserve existing folder names, including `landin-page` and `ship-rocket`, for compatibility.

Typical feature structure is a Nest module, controller, and service. Controllers expose HTTP endpoints and delegate business work to services. Services implement business rules and use injected dependencies. Feature modules declare imports, providers, and controllers. Shared schema registration and model access currently live in `DatabaseModule` and `DatabaseService`; follow the existing dependency injection pattern when working in a feature. Do not introduce a new architecture, shared abstraction layer, or module split without an explicit requirement.

`AppModule` loads configuration, connects Mongoose using the existing configuration, imports feature modules, and registers the global throttler guard. `main.ts` enables CORS and raw-body support used by gateway webhooks. Preserve these operational behaviors when changing bootstrap code.

## NestJS and TypeScript conventions

- Use TypeScript and NestJS decorators, dependency injection, modules, and built-in HTTP exceptions consistently with nearby code.
- Keep controllers focused on HTTP concerns: route definitions, parsing transport input, calling services, and shaping the HTTP response where appropriate. Keep business logic and persistence workflows in services.
- Register providers and imports in the owning module. Avoid reaching into another feature's implementation in ways that bypass its service/module boundary when a suitable exported provider exists.
- Follow the repository's existing import aliases (`src/...`) and formatting style in the file being changed. Avoid unrelated formatting or cleanup.
- Keep endpoint names, request/response shapes, status codes, and existing integration behavior compatible unless the task explicitly calls for an API change.
- Do not add dependencies or change package manifests unless explicitly requested.

## MongoDB and Mongoose

All current schemas are registered through `DatabaseModule` with `MongooseModule.forFeature`. Models are exposed on the injected `DatabaseService`. Use Mongoose models through Nest dependency injection; do not create unmanaged connections.

- Treat schema changes as API and data migrations. Preserve current collection names, field names, enums, defaults, references, embedded documents, indexes, and timestamps unless a schema change is explicitly requested.
- Product, cart, order, transaction, user, admin, customer, landing page, support ticket, OTP, webhook, and recommendation data use the schemas under `src/database/schema/`. Read the relevant schema before writing a query or update.
- References such as `Order.userId`, `Transaction.orderId`, `CartItem.productId`, and `LandingPage.productId` are Mongoose ObjectId references, not relational foreign keys. Validate IDs before constructing ObjectIds and handle missing referenced documents.
- Orders deliberately embed customer, address, and item snapshots. Do not replace historical snapshots with live product/user lookups when changing checkout or order reads.
- Product inventory is reserved using an atomic conditional decrement. Preserve the stock sufficiency predicate and transaction/session propagation in checkout workflows. Keep associated order and transaction writes in the same database transaction where the current workflow does so.
- MongoDB transactions require a deployment that supports transactions. Do not silently remove transaction/session handling from checkout.
- Use `lean()` for read-only query paths where hydrated document behavior is unnecessary. Use `populate()` only for relationships the response needs and select only required fields, especially for credentials and payment data.
- Add indexes only when supported by actual query patterns and account for uniqueness and existing data. Do not create duplicate or conflicting indexes casually.
- Preserve idempotency and duplicate-key handling in checkout and recommendation processing. Do not assume external gateway calls participate in MongoDB transactions.

## Controllers, services, and DTOs

Controllers in this repository commonly use inline TypeScript request types; dedicated DTOs are limited (for example, admin DTOs and the user address DTO). Continue the local pattern for a small, isolated change, but use explicit DTO classes with `class-validator` decorators when adding or substantially expanding request validation. TypeScript types alone do not validate incoming JSON at runtime.

Services own validation that protects business invariants even when a controller validates transport input. Do not trust client-provided prices, totals, discounts, roles, payment state, stock, or ownership. Derive authoritative values from the database and verified identity. Keep service inputs explicit and avoid passing unbounded request objects directly into Mongoose updates.

Before adding or changing a route, inspect its controller and service together. Keep public, authenticated, admin, webhook, and guest routes clearly distinguishable and preserve route compatibility. For updates, allowlist writable fields rather than forwarding arbitrary request properties.

## Validation and error handling

There is currently no global `ValidationPipe` configured in `main.ts`. Do not assume class-validator decorators run automatically. For new DTO-backed endpoints, wire validation deliberately at the intended scope (or add explicit service/controller validation consistent with the endpoint) and document any global behavior change before introducing one.

- Validate request shape, required strings, enum values, ObjectId format, quantity/range bounds, dates, and pagination limits at the boundary or in the service that enforces the invariant.
- Use Nest exceptions such as `BadRequestException`, `NotFoundException`, `UnauthorizedException`, `ForbiddenException`, and `ConflictException` for expected API errors.
- Preserve meaningful HTTP status codes and messages. Avoid broad catches that convert known Nest exceptions into unrelated errors or expose database/provider internals to clients.
- Log unexpected failures with enough operational context, but never log passwords, bearer tokens, OTP values, secrets, or sensitive payment data.
- Verify webhook signatures against the raw request body before applying business updates. Keep webhook processing idempotent.

## Authentication and authorization

Customer and admin identities use separate `UserAuthGuard` and `AdminAuthGuard` implementations and separate user/admin services. Admin tokens include a role; routes that require specific admin capabilities enforce role allowlists in addition to authentication. Preserve both checks and use the least-privileged role set appropriate to the operation.

- A valid authenticated identity must come from a verified token, never from a client-supplied `userId`, role, or similar body/query value. Cart and checkout currently have routes that verify tokens directly; when touching them, preserve current behavior while ensuring malformed or invalid supplied tokens fail closed.
- For every user-owned order, cart, address, support ticket, or profile operation, scope the database query or explicitly verify the authenticated owner. A valid token alone does not authorize access to another user's record.
- Guest flows use caller-supplied guest IDs in headers or path/body fields. Validate their format and length and scope every read/update to that guest identity. Do not expose guest records based on an unrelated or guessed identifier.
- Keep admin-only operations behind `AdminAuthGuard`; apply role authorization where the operation is restricted by role. Do not rely on frontend visibility for access control.
- Protect login, OTP, and other sensitive flows with the existing throttling mechanisms and preserve throttling when modifying those endpoints.

## Security practices

- Never add secrets, credentials, tokens, private keys, or real customer/payment data to source, tests, documentation, logs, or commits. Do not read or print `.env` contents as part of routine work.
- Keep password hashing and credential selection behavior intact. Passwords and OTP hashes must not be returned in API responses or ordinary query results.
- Validate uploaded image type and content, size, and generated storage key; do not trust a filename or MIME header supplied by a client.
- Verify Razorpay and Shiprocket webhook authenticity using their configured signature mechanisms before mutating records. Keep raw-body support for signed webhook validation.
- Do not accept client assertions of payment success. Update payment/order state only after trusted gateway verification or a verified webhook, and make repeated callbacks safe.
- Avoid leaking whether sensitive accounts exist where practical; return safe errors and never expose stack traces or provider responses directly.
- Preserve configured CORS restrictions and request throttling. Do not broaden origins or remove guards to work around local integration issues.

## Performance and scalability

- Keep list endpoints paginated, cap page sizes, and validate page/limit inputs. Follow existing response pagination conventions for the affected endpoint.
- Use indexes that match real filters and sort order. Review the existing schema indexes before proposing new ones.
- Prefer projections and `lean()` for read-only list/detail queries where appropriate. Avoid N+1 query patterns; batch related transaction or product reads when building order lists.
- Keep checkout transactions short and avoid slow external HTTP calls inside MongoDB transactions. External effects such as payment gateway, shipping, email, and messaging calls need explicit failure and retry/idempotency handling.
- Be cautious with regex search on large collections, large embedded arrays, deep offset pagination, and unbounded result sets. Preserve current API behavior while avoiding unnecessary payload fields.
- Do not add caching or background processing without a defined invalidation, consistency, and failure strategy.

## Jest testing requirements

The project uses Jest with `ts-jest`; unit specs are colocated under `src` as `*.spec.ts`, and end-to-end tests/configuration are under `test/` (`test/jest-e2e.json`). Use the existing setup and avoid adding a separate test framework.

- Add or update focused tests when changing behavior. Cover expected success, validation failures, authorization/ownership boundaries, and important failure or idempotency cases for the changed flow.
- For checkout/payment changes, cover stock reservation and rollback behavior, duplicate checkout handling, and verified versus invalid payment/webhook state as applicable.
- Mock external services (payment gateway, Shiprocket, S3, mail, WhatsApp) in unit tests; unit tests must not make real network calls or require production credentials.
- Keep tests deterministic and isolated from external databases unless an e2e test explicitly provisions an isolated test environment.
- Existing specs often only verify that a Nest provider/controller can be instantiated. Add meaningful behavior assertions for new or changed business logic rather than copying setup-only tests.
- Do not run tests unless the user asks for verification or testing, or the active task explicitly requires it. Do not install dependencies to make tests run without authorization.

## Git and modification safety

- Inspect `git status` and the relevant diff before editing. Preserve all pre-existing user changes; never reset, revert, overwrite, or reformat unrelated work.
- Make the smallest change that fulfills the requested task. Do not rename, delete, or move files unless explicitly requested.
- Do not modify database schemas, API contracts, environment configuration, package files, generated output, or deployment configuration unless the task authorizes that specific change.
- Do not install dependencies, run destructive commands, commit, push, deploy, or contact external services unless explicitly requested.
- After editing, inspect the diff and confirm only intended files changed. Report what changed and what verification was or was not performed.
