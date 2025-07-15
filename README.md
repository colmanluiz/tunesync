# TuneSync 🎵

A smart playlist converter SaaS that seamlessly transfers your music playlists between different streaming platforms.

## 🚀 Overview

TuneSync is a modern web application that allows users to convert and transfer their music playlists between various streaming services. Built with a robust backend API and a beautiful, responsive frontend, TuneSync provides a seamless experience for music enthusiasts who want to maintain their playlists across different platforms.

## ✨ Features

- **Multi-Platform Support**: Connect to Spotify, Apple Music, YouTube Music, and more
- **Smart Playlist Conversion**: Intelligent matching of songs across different platforms
- **User Authentication**: Secure email/password and Google OAuth authentication
- **Real-time Progress Tracking**: Monitor playlist conversion progress in real-time
- **Modern UI/UX**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Secure OAuth Flow**: Secure state management for OAuth authentication
- **Redis Caching**: Fast and efficient data caching with Redis

## 🏗️ Architecture

TuneSync follows a modern microservices architecture with the following components:

### Backend (NestJS)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with Passport.js
- **OAuth**: Google OAuth and Spotify OAuth integration
- **Caching**: Redis for session management and caching
- **API Documentation**: Auto-generated with Swagger

### Frontend (Next.js)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context and hooks
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Client-side auth state management

### Infrastructure

- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Containerization**: Docker and Docker Compose
- **Development**: Hot reload and development tools

## 🛠️ Tech Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Modern database toolkit
- **PostgreSQL** - Reliable database
- **Redis** - In-memory data store
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **Class Validator** - Validation decorators

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Axios** - HTTP client

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Yarn** or **npm**
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd playlist-project
```

### 2. Set Up Infrastructure

Start the required services (PostgreSQL, Redis, pgAdmin):

```bash
cd infra
docker-compose up -d
```

This will start:

- PostgreSQL database on port `5432`
- Redis cache on port `6379`
- pgAdmin on port `5050`

### 3. Set Up Backend

```bash
cd backend

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
yarn prisma migrate dev

# Start development server
yarn start:dev
```

The backend will be available at `http://localhost:3001`

### 4. Set Up Frontend

```bash
cd frontend

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tunesync"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
SPOTIFY_CALLBACK_URL="http://localhost:3001/auth/spotify/callback"

# Redis
REDIS_URL="redis://localhost:6379"

# App
PORT=3001
NODE_ENV=development

# Frontend URL for OAuth redirects
FRONTEND_URL="http://localhost:3000"
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_SPOTIFY_CLIENT_ID="your-spotify-client-id"
```

## 🗄️ Database Setup

The project uses Prisma as the ORM. To set up the database:

```bash
cd backend

# Generate Prisma client
yarn prisma generate

# Run migrations
yarn prisma migrate dev

# (Optional) Seed the database
yarn prisma db seed
```

## 🔐 Authentication Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

### Spotify OAuth

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new app
3. Add redirect URIs:
   - `http://localhost:3001/auth/spotify/callback` (development)
   - `https://yourdomain.com/auth/spotify/callback` (production)

## 📁 Project Structure

```
playlist-project/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── playlists/      # Playlist operations
│   │   ├── spotify/        # Spotify integration
│   │   ├── state/          # OAuth state management
│   │   └── common/         # Shared utilities
│   ├── prisma/             # Database schema and migrations
│   └── test/               # Backend tests
├── frontend/               # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # Reusable components
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── contexts/           # React contexts
└── infra/                  # Infrastructure configuration
    └── docker-compose.yml  # Docker services
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run e2e tests
yarn test:e2e

# Generate coverage report
yarn test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
yarn build
yarn start:prod

# Frontend
cd frontend
yarn build
yarn start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose -f infra/docker-compose.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Git Workflow

- Use conventional commit messages
- Create feature branches for new functionality
- Keep commits atomic and focused
- Write descriptive PR descriptions

### Testing

- Write unit tests for business logic
- Add integration tests for API endpoints
- Maintain good test coverage
- Test OAuth flows thoroughly

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**

- Ensure PostgreSQL is running: `docker compose ps`
- Check DATABASE_URL in .env file
- Run migrations: `yarn prisma migrate dev`

**Redis Connection Issues**

- Ensure Redis is running: `docker compose ps`
- Check REDIS_URL in .env file
- Verify Redis port (6379) is not blocked

**OAuth Issues**

- Verify client IDs and secrets in .env
- Check redirect URIs match exactly
- Ensure HTTPS in production

**Frontend Build Issues**

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `yarn install`
- Check TypeScript errors: `yarn lint`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) for the amazing backend framework
- [Next.js](https://nextjs.org/) for the React framework
- [Prisma](https://www.prisma.io/) for the database toolkit
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Made with ❤️ by Luiz Colman
