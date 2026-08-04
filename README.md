# AI Image Toolkit

An all-in-one web application for AI-powered image editing, enhancement, conversion and PDF export.

[Live Demo](https://ai.dawidfrankowicz.com/) · [GitHub Repository](https://github.com/dawiditwork/ai-image-editor)

## Overview

AI Image Toolkit combines AI-powered editing with practical image utilities in one responsive workspace.

Users can upload JPG, PNG or WebP images, apply AI transformations, convert files and export finished results directly from the browser.

## Features

### AI Tools

- AI image editing using text instructions
- Automatic background removal
- AI-powered image upscaling
- Smart subject detection and focus

### Free Image Utilities

- Image resizing
- JPG, PNG and WebP conversion
- Single image to PDF
- Multiple images to PDF
- Browser-based file export

### Platform Features

- User authentication
- Personal project workspace
- Credit-based access to AI operations
- Ten free AI credits for new accounts
- Responsive interface for desktop, tablet and mobile
- Contact form and transactional email support

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- Neon PostgreSQL
- Better Auth
- ImageKit
- TanStack Query
- React Hook Form
- Zod
- jsPDF
- Resend
- Radix UI

## Getting Started

### Requirements

- Node.js 20 or newer
- npm
- PostgreSQL database
- ImageKit account

### Installation

```bash
git clone https://github.com/dawiditwork/ai-image-editor.git
cd ai-image-editor
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Complete the required environment variables and prepare the database:

```bash
npx prisma generate
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

The application runs locally on:

```text
http://localhost:3050
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm run format:check
```

## Project Status

AI Image Toolkit is currently in public beta.

Free image utilities are available without consuming credits. AI Image Edit, Background Removal and AI Upscaling use AI credits. Payments are currently disabled while the public release is being prepared.

## Author

Designed and developed by [Dawid Frankowicz](https://github.com/dawiditwork).

- Portfolio: [dawidfrankowicz.com](https://www.dawidfrankowicz.com/)
- Email: [dawiditwork@gmail.com](mailto:dawiditwork@gmail.com)(https://create.t3.gg/en/deployment/docker) for more information.
