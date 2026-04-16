# 🌳 Premium Family Tree (Silsilah Keluarga)

A modern, interactive, and intelligent family tree web application built for seamless visualization and data management. Designed as a high-value software product, this application automatically calculates family relationships, organizes complex tree layouts, and provides a secure admin dashboard.

---

## ✨ Key Features

- **🧠 Smart Relation Engine:** Automatically calculates and labels relationships (e.g., Uncle, Great-Grandfather, Daughter-in-law) dynamically based on the selected "Root Person".
- **🕸️ Interactive Canvas:** Powered by React Flow with an auto-layout algorithm (Dagre) to ensure the family tree is always organized, no matter how complex the data gets.
- **📸 Ultra-HD PNG Export:** One-click export to download the entire family tree seamlessly without cropping, complete with a clean UI (hiding controls).
- **🔒 Secure Admin Panel:** Built-in authentication using Next.js Middleware and `bcrypt` password hashing to protect family data from unauthorized access.
- **⚡ Dynamic CRUD:** Full control to Add, Edit, and Delete family members with beautiful Custom Modals and real-time Toast notifications.
- **🎨 Premium UI/UX:** Styled with Tailwind CSS, featuring smooth transitions, a beautiful "Ocean Wave" background, and responsive design.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14/15](https://nextjs.org/) (App Router, Server Actions)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Visualization:** [React Flow](https://reactflow.dev/) (`@xyflow/react`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Utilities:** `html-to-image` (Export), `react-hot-toast` (Notifications), `bcryptjs` (Auth)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites

- Node.js (v18 or higher)
- A [Supabase](https://supabase.com/) account (or any PostgreSQL database)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone [https://github.com/Azizsige/next-family-tree.git](https://github.com/Azizsige/next-family-tree.git)
cd next-family-tree
npm install
```

### 3. Environment Variables

Create a .env file in the root directory and add your Supabase connection string:

# Connect to Supabase via connection pooling with Supavisor.

DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@[aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true](https://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true)"

# Direct connection to the database. Used for migrations.

DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@[aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres](https://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres)"

### 4. Database Setup

Push the Prisma schema to your database and generate the Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

### 5. Run the Development Server

Start the application locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action!

## 🔐 Admin Authentication

To access the /admin dashboard, you need an initial admin account.

If you are running this for the first time, click the "🛠️ Inject Akun Admin" button at the bottom of the /login page to seed the initial credentials:

Email: admin@admin.com

Password: admin123

(Note: Remember to remove the inject button in the app/login/page.tsx file before deploying to production!)

## 📦 Deployment

This Next.js app is optimized for deployment on Vercel.

Push your code to GitHub.

Import the project into Vercel.

Add your DATABASE_URL and DIRECT_URL to Vercel's Environment Variables.

Deploy!
