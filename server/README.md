# AssetFlow ERP Backend API

The Node.js and Express backend API for AssetFlow, a modern enterprise asset resource planning and management platform. Powered by Prisma ORM and PostgreSQL.

---

## Features Complete
- **Authentication**: JWT authentication with HTTP-Only Secure cookies and bearer fallback.
- **Departments**: Structural division and circular-hierarchy checks.
- **Categories**: Category mappings with deletion prevention guards.
- **Employee Directory**: Profile management, status deactivation blocks for admins, and promotions.
- **Asset Management**: Automatic tag coding (`AF-000001` format), Cloudinary uploads for images/documents, and automated QR code PNG generations.
- **Allocations**: Atomically check-out and return assets with condition tracking.
- **Transfers**: Employee-to-employee transfer requests with admin approval transaction workflows.
- **Resource Bookings**: Room and equipment booking with time-overlap checking.
- **Maintenance Repair**: Maintenance request ticketing workflow (Pending -> Approved -> Assigned Technician -> In Progress -> Resolved).
- **Asset Audits**: Verification cycles (Verified, Missing, Damaged), automatic transition of missing assets to `LOST`, and discrepancy logs.
- **Notifications**: Automated alerts generated for checkout timelines, bookings, approvals, and discrepancies.
- **Role-Based Dashboard**: Custom metrics dashboard computed dynamically for `ADMIN`, `ASSET_MANAGER`, `DEPARTMENT_HEAD`, and `EMPLOYEE` roles.
- **Swagger Documentation**: Exposes rich API listings at `/api-docs`.

---

## Tech Stack
- **Core**: Node.js & Express.js
- **Database**: PostgreSQL (using Neon DB Serverless pooling)
- **ORM**: Prisma 7.x (with `@prisma/adapter-pg` driver adapter)
- **Validation**: Zod (strict parameter and body parsing schemas)
- **Storage & Media**: Cloudinary (memory buffer file uploads)
- **Utilities**: `qrcode`, `node-cron`, `streamifier`

---

## Getting Started

### 1. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your_secure_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma client & Apply Migrations
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run Seed Script
Populates mock data (Admin, Managers, categories, and test assets) so the application is ready to run immediately:
```bash
npx prisma db seed
```

Seeded credentials (Password for all users: `password123`):
* **Admin**: `admin@assetflow.com`
* **Asset Manager**: `manager@assetflow.com`
* **Department Head**: `head@assetflow.com`
* **Employee**: `employee@assetflow.com`

### 5. Start Development Server
```bash
npm run dev
```

The server starts on port `5000`.

---

## API Documentation

Once the server is running, navigate to:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

This serves the interactive Swagger UI to test all authentication, employee, asset, allocation, repair, and cycle endpoints.
