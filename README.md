# AI Image Toolkit

A full-stack SaaS application for AI-powered image editing, image utilities, project management, and credit-based AI operations.

[Live Demo](https://ai.dawidfrankowicz.com/) · [GitHub Repository](https://github.com/dawiditwork/ai-image-editor)

## Overview

AI Image Toolkit combines AI image processing with practical browser-based image utilities in one responsive workspace.

Users can upload images, save projects, apply paid AI transformations, use free image tools, export files, purchase credits, and review their billing history.

## Features

### AI Tools

- AI image editing with text prompts
- Automatic background removal
- AI-powered image upscaling
- Smart subject focus / smart crop

AI operations consume credits.

### Free Image Utilities

- Image resizing
- JPG, PNG and WebP conversion
- Images to PDF
- Browser-based file export

### Project Management

- Upload images directly to ImageKit
- Automatically create user-owned projects
- Persist image transformations
- Reopen previous projects
- Search and sort projects
- Delete projects together with their ImageKit files

### Authentication

- Email and password authentication
- Email verification
- Password reset
- Session-based authentication
- Protected dashboard views
- Better Auth integration

### Payments and Credits

- Credit-based access to AI operations
- Polar checkout
- Small, Medium and Large credit packages
- Server-side fulfillment through Polar webhooks
- Billing and purchase history
- Customer portal
- Idempotent order processing
- Duplicate-payment protection

### Reliability and Security

- Atomic credit deduction
- Automatic refund when a paid AI transformation fails at the provider
- Database transactions for balance + project consistency
- Project ownership checks
- Zod input validation
- Unique order constraints for webhook idempotency
- Sentry error monitoring

## Technology Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React
- Sonner

### Backend and Data

- Next.js Server Actions
- Next.js Route Handlers
- Prisma ORM
- PostgreSQL / Neon
- Zod

### Services

- Better Auth — authentication and sessions
- ImageKit — image storage and transformations
- Polar — checkout, webhooks and customer portal
- Resend — transactional email
- Sentry — error monitoring
- jsPDF — PDF generation

### Testing and DevOps

- Vitest
- Testing Library
- Playwright
- jsdom
- Docker
- GitHub Actions
- Vercel

## Architecture

```text
User Interface
     │
     ▼
React Components
     │
     ▼
Custom Hooks
     │
     ▼
Server Actions / API Routes
     │
     ▼
Business Logic
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL
```

External services:

```text
Application
 ├── Better Auth → authentication
 ├── ImageKit    → storage + image transformations
 ├── Polar       → payments + webhooks + customer portal
 ├── Resend      → transactional email
 └── Sentry      → error monitoring
```

## Credit System

Every new account starts with 10 credits.

| Operation | Cost |
|---|---:|
| Background Removal | 2 credits |
| AI Upscale | 1 credit |
| Smart Subject Focus | 1 credit |
| AI Image Edit | 2 credits |

Resize, format conversion and PDF generation do not consume credits.

Paid operations are processed on the server. Credit deduction uses an atomic database condition requiring the user's balance to be greater than or equal to the operation cost before decrementing it. This prevents concurrent requests from overspending the same balance.

## Paid AI Transformation Flow

```text
User clicks AI operation
        │
        ▼
Client hook
        │
        ▼
Server Action
        │
        ▼
Authenticate user
        │
        ▼
Check project ownership
        │
        ▼
Validate stored transformations
        │
        ▼
Check + deduct credits atomically
        │
        ▼
Save transformation
        │
        ▼
Commit database transaction
        │
        ▼
ImageKit renders the result
```

If ImageKit fails to render a paid transformation, the app removes that failed transformation and refunds the corresponding credits.

Manual undo does not refund credits.

## Payment Flow

```text
User chooses package
        │
        ▼
Polar Checkout
        │
        ▼
Payment completed
        │
        ▼
Polar webhook
        │
        ▼
processPolarOrder()
        │
        ▼
Validate customer + product
        │
        ▼
Create Purchase
        │
        ├── same transaction ──► increment user credits
        │
        ▼
Purchase appears in Billing
```

The client-side success redirect is not treated as proof of payment. The Polar webhook is the source of truth for fulfillment.

## Idempotency

Each Polar order is stored with a unique order ID:

```prisma
polarOrderId String @unique
```

The application first checks whether the order already exists. The database unique constraint provides a second protection layer against concurrent duplicate webhook deliveries.

Prisma error `P2002` is treated as an already-processed order, preventing duplicate credit fulfillment.

## Main Database Models

```text
User
 ├── Sessions
 ├── Accounts
 ├── Projects
 └── Purchases
```

### User

Stores account data, authentication relations, and the current credit balance.

### Project

Stores project ownership, ImageKit references, file paths, and saved transformations.

### Purchase

Stores the Polar order ID, purchased credits, package metadata, price, currency, status, and creation date.

## Testing

The project includes unit/component tests with Vitest and browser E2E tests with Playwright.

### Unit / component tests

Coverage includes:

- paid project actions
- atomic credit handling
- provider-failure refunds
- duplicate refund prevention
- Polar order processing
- duplicate webhook handling
- missing customer / unknown product cases
- project ownership
- checkout UI
- credit package mapping

Run:

```bash
npm run test:run
```

### End-to-end tests

Playwright covers browser flows including:

- application loading
- authenticated dashboard access
- Buy Credits dialog
- image upload
- image resizing

Run:

```bash
npm run test:e2e
```

## Continuous Integration

GitHub Actions runs tests for pushes and pull requests targeting `main`.

```text
Checkout
   │
   ▼
Install dependencies
   │
   ▼
Generate Prisma Client
   │
   ▼
Vitest
   │
   ▼
Playwright E2E
   │
   ▼
Upload Playwright report
```

## Docker

The project includes a multi-stage production Docker build:

```text
deps
  │
  ▼
builder
  │
  ▼
runner
```

## Getting Started

### Requirements

- Node.js 20+
- npm
- PostgreSQL database
- ImageKit account
- Better Auth configuration
- Polar configuration
- Resend configuration

### Installation

```bash
git clone https://github.com/dawiditwork/ai-image-editor.git
cd ai-image-editor
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

Generate Prisma Client and synchronize the development database:

```bash
npx prisma generate
npx prisma db push
```

Start development:

```bash
npm run dev
```

Local URL:

```text
http://localhost:3050
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run test:run
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
npm run format:check
npm run format:write
npm run db:push
npm run db:studio
```

## Project Status

AI Image Toolkit is a working full-stack SaaS project with:

- authentication
- persistent user projects
- AI image processing
- credit accounting
- Polar checkout and webhook fulfillment
- billing history
- automatic provider-failure refunds
- unit/component tests
- browser E2E tests
- CI
- Docker support
- Sentry monitoring

## Author

Designed and developed by [Dawid Frankowicz](https://github.com/dawiditwork).

- Portfolio: [dawidfrankowicz.com](https://www.dawidfrankowicz.com/)
- Email: [dawiditwork@gmail.com](mailto:dawiditwork@gmail.com)
