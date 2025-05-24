src/
│
├── modules/                # Feature-specific modules (Domain Logic)
│   ├── auth/               # Authentication (JWT, Passport, Guards)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   │
│   ├── user/               # User management (CRUD, profile)
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   ├── user.schema.ts  # Mongoose schema
│   │   ├── dto/
│   │   │   └── update-user.dto.ts
│   │   └── interfaces/
│   │       └── user.interface.ts
│   │
│   ├── manga/              # Manga CRUD, Business Logic
│   │   ├── manga.controller.ts
│   │   ├── manga.service.ts
│   │   ├── manga.module.ts
│   │   ├── manga.schema.ts
│   │   ├── dto/
│   │   │   └── create-manga.dto.ts
│   │   └── interfaces/
│   │       └── manga.interface.ts
│   │
│   ├── chapter/            # Manga Chapters CRUD
│   │   ├── chapter.controller.ts
│   │   ├── chapter.service.ts
│   │   ├── chapter.module.ts
│   │   ├── chapter.schema.ts
│   │   ├── dto/
│   │   │   └── create-chapter.dto.ts
│   │   └── interfaces/
│   │       └── chapter.interface.ts
│   │
│   ├── comment/            # Comment CRUD
│   │   ├── comment.controller.ts
│   │   ├── comment.service.ts
│   │   ├── comment.module.ts
│   │   ├── comment.schema.ts
│   │   ├── dto/
│   │   │   └── create-comment.dto.ts
│   │   └── interfaces/
│   │       └── comment.interface.ts
│   │
│   └── shared/             # Shared services, utilities, helpers
│       ├── dto/
│       ├── constants.ts    # Shared constants
│       ├── utils.ts        # Utility functions (e.g., email validation)
│       └── database/       # Database connections or services
│           └── mongoose/
│               └── database.service.ts
│
├── common/                 # Global concerns (filters, guards, interceptors, pipes)
│   ├── filters/            # Exception filters (e.g., global error handling)
│   │   └── http-exception.filter.ts
│   ├── guards/             # Guards (e.g., Authorization checks)
│   │   └── auth.guard.ts
│   ├── interceptors/       # Interceptors (e.g., logging, transformations)
│   │   └── logging.interceptor.ts
│   └── pipes/              # Validation pipes (e.g., DTO validation)
│       └── validation.pipe.ts
│
├── config/                 # Application configuration (app, database, etc.)
│   ├── app.config.ts       # Global config (app name, version, port)
│   └── database.config.ts  # MongoDB/Database connection config
│
├── database/               # Database models and logic (ORM models, Mongoose schemas)
│   └── models/             # Mongoose schemas, TypeORM models (MongoDB)
│       └── user.schema.ts  # Example: Mongoose user schema
│
├── app.module.ts           # Root application module (bootstraps everything)
└── main.ts                 # Main entry file (NestJS bootstrap)