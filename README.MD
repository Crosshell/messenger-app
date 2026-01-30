# 💬 Real-Time Messenger App

Full-stack real-time chat application built with **React**, **NestJS**, **PostgreSQL**, and **Docker**.
This project features secure authentication, 
real-time messaging via Socket.IO, file attachments using AWS S3

## ✨ Features

* **Authentication & Security**:
* JWT-based auth with Access & Refresh tokens
* Email verification and Password Reset flows


* **Real-Time Messaging**:
* Instant message delivery using Socket.IO
* Read receipts
* Edit and Delete message functionality
* Reply to specific messages


* **Media Support**:
* File attachments (Drag & Drop support)
* Image previews
* Secure direct-to-S3 uploads via Presigned URLs


* **User Experience**:
* Infinite scrolling for chat history
* Optimistic UI updates
* Responsive design with TailwindCSS
* Emoji picker integration


## 🛠 Tech Stack

### Frontend (`apps/messenger-client`)

* **Framework**: React (Vite)
* **Language**: TypeScript
* **State Management**: Zustand & TanStack Query (React Query)
* **Styling**: TailwindCSS
* **Forms**: React Hook Form + Zod
* **Real-time**: Socket.IO Client

### Backend (`apps/messenger-api`)

* **Framework**: NestJS
* **Language**: TypeScript
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Storage**: AWS S3 (via AWS SDK v3)
* **Email**: Nodemailer (SMTP)

### DevOps

* **Containerization**: Docker & Docker Compose

---

## 🚀 Getting Started

You can run the project using **Docker** (recommended for quick start)
or **Manually** (for active development)

### 1. Prerequisites

* [Node.js](https://nodejs.org/) (v20+ recommended)
* [Docker](https://www.docker.com/) & Docker Compose
* An AWS Account (S3 Bucket) for file uploads
* An SMTP Server (e.g., Gmail, SendGrid, or Ethereal for testing) for emails

## ⚙️ Environment Configuration

### Root Environment Variables

Create `.env` file in the project root:

```bash
cp .env.sample .env
```

Edit `.env`:

```dotenv
# PostgreSQL Configuration (for Docker)
POSTGRES_PORT=5432
POSTGRES_USER=messenger_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=messenger_db

# Application Ports
API_PORT=3000
CLIENT_PORT=5173
```

### Backend Environment Variables

Create `.env` file in `apps/messenger-api/`:

```bash
cd apps/messenger-api
cp .env.sample .env
```

Edit `apps/messenger-api/.env`:

```dotenv
# App Configuration
PORT=3000
NODE_ENV=development

# JWT Security
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=900  # 15 minutes in seconds

# Token Lifetimes
TOKEN_PASSWORD_TTL=3600000      # 1 hour in milliseconds
TOKEN_EMAIL_TTL=86400000        # 24 hours in milliseconds
TOKEN_REFRESH_TTL=604800000     # 7 days in milliseconds
MAX_REFRESH_TOKENS=5

# Database
DATABASE_URL=postgresql://messenger_user:your_secure_password_here@messenger-postgres:5432/messenger_db

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your-bucket-name

# File Upload Limits
MAX_FILE_SIZE=10485760          # 10MB in bytes
MAX_ATTACHMENTS=5

# Client Configuration
CLIENT_BASE_URL=http://localhost:5173

# Cookie Security
COOKIE_SECRET=your_cookie_secret_min_32_chars
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax            # lax | strict | none

# Email/SMTP Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false              # true for 465, false for other ports
EMAIL_FROM=noreply@yourdomain.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your_app_password  # Use App Password for Gmail
```

#### 🔑 Important Notes for Backend Environment:

**Database URL for Docker**:
- Use service name `messenger-postgres` as host
- For local PostgreSQL: `postgresql://user:password@localhost:5432/db_name`

**AWS S3 Setup**:
1. Create an S3 bucket in AWS Console
2. Create IAM user with S3 permissions
3. Generate access keys
4. Update bucket policy

**Email Setup (Gmail)**:
1. Enable 2-factor authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use App Password in `SMTP_PASSWORD`

### Frontend Environment Variables

Create `.env` file in `apps/messenger-client/`:

```bash
cd apps/messenger-client
cp .env.sample .env
```

Edit `apps/messenger-client/.env`:

```env
VITE_API_URL=http://localhost:3000
```


---

## 🐳 Option 1: Running with Docker (Recommended)

This method spins up the Database, Backend, and Frontend in containers

1. **Clone the repository:**

```bash
git clone https://github.com/Crosshell/messenger-app
cd messenger-app
```


2. **Ensure all `.env` files are created** (see step 2 above)
3. **Build and Start:**
```bash
docker compose -f docker-compose.dev.yml up --build
```


4. **Access the App:**
* **Frontend:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
* **Backend API:** [http://localhost:3000/api](https://www.google.com/search?q=http://localhost:3000/api)
* **Database:** Port `5432`


*Note: Migrations are applied automatically on startup in the Docker setup*

---

## 💻 Option 2: Manual Local Development

If you prefer to run Node.js locally while keeping the database in Docker

1. **Start the Database only:**

```bash
docker compose -f docker-compose.dev.yml up messenger-postgres
```


2. **Setup Backend (`apps/messenger-api`):**
* Update `DATABASE_URL` in `apps/messenger-api/.env` to point to `localhost`:
  `postgres://myuser:mypassword@localhost:5432/messenger_db`
* Run commands:

```bash
cd apps/messenger-api
npm install
npx prisma generate
npx prisma migrate dev  # Run migrations
npm run start:dev       # Start Server
```


3. **Setup Frontend (`apps/messenger-client`):**
* Run commands:

```bash
cd apps/messenger-client
npm install
npm run dev
```