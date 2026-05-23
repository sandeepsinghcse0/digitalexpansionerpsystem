# ERP MVP - Setup Guide

Full-stack ERP MVP built with:

* Next.js
* TypeScript
* MySQL
* Prisma ORM
* Auth.js
* Tailwind CSS

Modules Included:

* Authentication
* Customer Management
* Sales & Billing
* Inventory
* Expense Tracking
* Reports

---

# 1. Prerequisites

Install the following:

## Required Software

* Node.js (v20+ recommended)
* MySQL Server
* Git
* VS Code

---

# 2. Clone Project

```bash
git clone <your-repository-url>
```

Go inside project:

```bash
cd erp-system
```

---

# 3. Install Dependencies

```bash
npm install
```

---

# 4. Environment Setup

Create:

```txt
.env
```

Add:

```env
DATABASE_URL="mysql://root:password@localhost:3306/erp_mvp"

AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"
```

Generate secret:

```bash
openssl rand -base64 32
```

---

# 5. Create Database

Open MySQL:

```sql
CREATE DATABASE erp_mvp;
```

---

# 6. Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Push schema to database:

```bash
npx prisma db push
```

---

# 7. Seed Admin User

Install tsx:

```bash
npm install -D tsx
```

Run seed:

```bash
npx prisma db seed
```

Default admin credentials:

```txt
Email: admin@erp.com
Password: Admin@123
```

---

# 8. Start Development Server

```bash
npm run dev
```

Open browser:

```txt
http://localhost:3000
```

Login page:

```txt
http://localhost:3000/login
```

---

# 9. Project Structure

```txt
src/
 ├── app/
 │    ├── api/
 │    ├── dashboard/
 │    ├── customers/
 │    ├── inventory/
 │    ├── invoices/
 │    ├── expenses/
 │    ├── reports/
 │    └── login/
 │
 ├── components/
 │
 ├── lib/
 │    ├── auth/
 │    ├── db/
 │    ├── services/
 │    ├── utils/
 │    └── validations/
 │
 ├── hooks/
 ├── modules/
 ├── types/
 │
 └── auth.ts

prisma/
 ├── schema.prisma
 └── seed.ts
```

---

# 10. Important Commands

## Run Development Server

```bash
npm run dev
```

## Build Production

```bash
npm run build
```

## Start Production

```bash
npm start
```

## Prisma Generate

```bash
npx prisma generate
```

## Prisma Push

```bash
npx prisma db push
```

## Prisma Migration

```bash
npx prisma migrate dev --name init
```

## Open Prisma Studio

```bash
npx prisma studio
```

---

# 11. Authentication Flow

Authentication uses:

* Auth.js
* JWT session strategy
* Credentials provider
* bcrypt password hashing

Protected routes:

```txt
/dashboard
/customers
/inventory
/invoices
/expenses
/reports
```

---

# 12. ERP Modules

## Authentication

* Login
* Logout
* Role-based access

## Customer Management

* Add customers
* Edit customers
* Customer ledger

## Inventory

* Product management
* Stock management
* SKU tracking

## Sales & Billing

* Create invoices
* GST calculation
* Payment tracking

## Expenses

* Expense categories
* Expense reports

## Reports

* Sales reports
* Expense reports
* Pending payments

---

# 13. Recommended VS Code Extensions

* Prisma
* ESLint
* Tailwind CSS IntelliSense
* Prettier
* GitLens

---

# 14. Common Issues

## Prisma Client Error

Run:

```bash
npx prisma generate
```

---

## Database Connection Error

Check:

* MySQL service is running
* DATABASE_URL is correct
* Database exists

---

## Auth Not Working

Check:

* AUTH_SECRET exists
* route.ts exists
* auth.ts exists

---

## Module Alias Error

Update:

`tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

# 15. Recommended Development Order

Build modules in this sequence:

1. Authentication
2. Dashboard Layout
3. Customer CRUD
4. Product CRUD
5. Invoice Module
6. Inventory Management
7. Expense Tracking
8. Reports
9. Notifications

---

# 16. Deployment

Recommended:

## Frontend + Backend

* Vercel
  OR
* AWS EC2

## Database

* AWS RDS MySQL
* PlanetScale
* Railway

## File Storage

* AWS S3

---

# 17. Security Recommendations

Always:

* Hash passwords
* Use HTTPS in production
* Validate APIs
* Use middleware protection
* Restrict admin routes
* Use environment variables

---

# 18. Future Improvements

Phase 2 ideas:

* Purchase management
* Supplier module
* Multi-warehouse
* Payroll
* Attendance
* GST filing
* WhatsApp integration
* AI insights
* Mobile app

---

# 19. Tech Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Frontend       | Next.js                |
| Backend        | Next.js Route Handlers |
| Database       | MySQL                  |
| ORM            | Prisma                 |
| Authentication | Auth.js                |
| Styling        | Tailwind CSS           |
| Validation     | Zod                    |
| Forms          | React Hook Form        |

---

# 20. Production Notes

For production:

* Use connection pooling
* Add logging
* Add audit logs
* Add database backups
* Add monitoring
* Add rate limiting
* Use transactions for invoices

---

# 21. Default Admin Credentials

```txt
Email: admin@erp.com
Password: Admin@123
```

Change password immediately after first login.
