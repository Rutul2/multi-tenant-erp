# Multi-Tenant Business ERP

A robust, multi-tenant Enterprise Resource Planning (ERP) application built with the MERN stack. Designed as a B2B SaaS solution to help business owners (specifically in industries like textile job working) manage labor logs, track daily wages, and generate automated PDF invoices.

## 🚀 Key Features

* **Multi-Tenant Architecture:** Secure data isolation using `tenantId`. Multiple businesses can use the same application and database without ever seeing each other's data.
* **Role-Based Access Control (RBAC):** Distinct roles for 'Admin' (Business Owner), 'Manager', and 'Worker', ensuring users only access authorized routes and data.
* **Labor Management:** Workers and managers can log daily tasks, job types, quantities, and piece-rates to automatically calculate total wages.
* **Automated Invoicing:** Admins can select unbilled, pending labor logs to generate consolidated invoices for specific billing periods.
* **PDF Export:** Built-in PDF generation engine allowing business owners to instantly download physical copies of invoices to send to clients.
* **Secure Authentication:** JWT-based stateless authentication with Redux Toolkit for global state management and Axios interceptors for automated token handling.

## 💻 Tech Stack

**Frontend:**
* React.js (Vite)
* Redux Toolkit (State Management)
* Tailwind CSS (Styling)
* React Router DOM (Routing)
* Axios (HTTP Client)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (ODM)
* JSON Web Tokens (JWT) & bcryptjs (Security)
* PDFKit (Document Generation)

## 🏗️ Architecture Overview

This project utilizes a **Logical Data Isolation** approach for multi-tenancy. 
* When a new business registers, a unique `tenantId` is generated.
* Every subsequent user, labor log, and invoice created under that business is permanently tagged with this `tenantId`.
* Custom Express middleware automatically intercepts all incoming backend requests, extracts the user's `tenantId` from their verified JWT, and injects it into the database queries, ensuring complete data security between client businesses.

## 🛠️ Local Development Setup

### Prerequisites
* Node.js installed
* MongoDB instance (Local or Atlas) running

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/multi-tenant-erp.git
cd multi-tenant-erp
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.
