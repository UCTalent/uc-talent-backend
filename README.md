# UC Talent Backend

A Domain Driven Design (DDD) backend application built with NestJS, TypeScript, and PostgreSQL.

## 🏗️ Architecture

This project follows Domain Driven Design principles with the following structure:

```
src/
├── domains/           # Domain modules
│   ├── user/         # User management
│   ├── talent/       # Talent profiles
│   ├── job/          # Job postings
│   ├── organization/ # Companies
│   ├── location/     # Geographic data
│   ├── skill/        # Skills & roles
│   ├── payment/      # Payment processing
│   ├── social/       # Social accounts
│   ├── partner/      # Partner management
│   └── notification/ # Email & notifications
├── infrastructure/   # Infrastructure concerns
│   ├── database/     # Database configuration
│   ├── authentication/ # Auth strategies
│   ├── background-jobs/ # Background processing
│   └── email/        # Email services
├── shared/          # Shared concerns
│   ├── infrastructure/ # Shared infrastructure
│   └── cross-cutting/ # Cross-cutting concerns
└── application/     # Application services
```

## 🚀 Features

- **Domain Driven Design**: Clean separation of business logic
- **REST API**: Full RESTful endpoints
- **GraphQL**: Apollo GraphQL server
- **Authentication**: JWT + OAuth2 + Firebase + Web3
- **Database**: PostgreSQL with TypeORM
- **Background Jobs**: BullMQ with Redis
- **Email**: AWS SES integration
- **File Storage**: AWS S3
- **Caching**: Redis caching
- **Rate Limiting**: Request throttling
- **Validation**: Class-validator
- **Testing**: Jest testing framework

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Redis (v6 or higher)
- Docker (optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uc-talent-backend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Create database
   createdb uc_talent
   
   # Run migrations (when available)
   yarn migration:run
   ```

5. **Start the application**
   ```bash
   # Development
   yarn start:dev
   
   # Production
   yarn build
   yarn start:prod
   ```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

- **Database**: PostgreSQL connection
- **Authentication**: JWT secrets, Firebase config
- **AWS**: S3 and SES credentials
- **Redis**: Cache and background jobs
- **Third-party**: API keys

### Database

The application uses PostgreSQL with the following main tables:

- `users` - User accounts
- `talents` - Talent profiles
- `jobs` - Job postings
- `organizations` - Companies
- `skills`, `specialities`, `roles` - Skills management
- `cities`, `countries`, `regions` - Location data
- `payment_distributions` - Payment tracking
- `social_accounts` - Social login accounts

## 📚 API Documentation

### REST API

Base URL: `http://localhost:3001/api/v1`

#### Authentication
- `POST /auth/firebase` - Firebase authentication
- `POST /auth/thirdweb` - Web3 authentication

#### Users
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `POST /users` - Create user

#### Talents
- `GET /talents/me` - Get current talent profile
- `POST /talents` - Create talent profile
- `PUT /talents/:id` - Update talent profile

#### Jobs
- `GET /jobs` - List jobs
- `GET /jobs/:id` - Get job details
- `POST /jobs` - Create job
- `POST /jobs/:id/apply` - Apply to job

### GraphQL

Playground: `http://localhost:3001/graphql`

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📦 Scripts

```bash
# Development
yarn start:dev          # Start with hot reload
yarn start:debug        # Start with debugger

# Production
yarn build              # Build application
yarn start:prod         # Start production server

# Database
yarn migration:generate  # Generate migration
yarn migration:run      # Run migrations
yarn migration:revert   # Revert migration

# Code quality
yarn lint               # Lint code
yarn format             # Format code
```

## 🏛️ Domain Structure

### User Domain
- Authentication & authorization
- Profile management
- Social login integration

### Talent Domain
- Professional profiles
- Experience & education
- Skills & specialities
- Resume management

### Job Domain
- Job postings
- Application tracking
- Referral system
- Web3 integration

### Organization Domain
- Company profiles
- Industry classification
- Location management

### Payment Domain
- Payment distribution
- Wallet management
- Blockchain integration

## 🔐 Security

- JWT token authentication
- Role-based access control
- Rate limiting
- Input validation
- CORS configuration

## 📈 Performance

- Redis caching
- Database indexing
- Background job processing
- Connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
