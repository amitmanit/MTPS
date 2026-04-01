# 🏫 Mother Teresa Public School — Full-Stack Website

A complete, modern, responsive school website built with **Node.js**, **Express**, **MongoDB**, **EJS**, and **Bootstrap 5**.

## 📋 Features

- **8 Public Pages**: Home, About, Admissions, Academics, Facilities, Gallery, Notices, Contact
- **Admin Dashboard**: Manage notices, gallery, admissions, and contact messages
- **Online Admission Form**: Parents can submit applications; admin can approve/reject
- **Photo Gallery**: Category-based filtering, file upload support
- **Notice Board**: Important/normal notices with date display
- **Contact Form**: With Google Maps integration
- **Responsive Design**: Mobile-friendly on all screen sizes
- **SEO Optimized**: Meta tags, semantic HTML, fast loading
- **Secure Admin Auth**: bcrypt password hashing, session-based authentication

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Frontend | EJS + Bootstrap 5 + Custom CSS |
| Auth | bcryptjs + express-session |
| File Upload | multer |
| Session Store | connect-mongo |

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) — [Download](https://www.mongodb.com/try/download/community)

### Installation

```bash
# 1. Navigate to project folder
cd mother-teresa-school

# 2. Install dependencies
npm install

# 3. Make sure MongoDB is running
# On Windows: 'mongod' or start MongoDB service
# On Mac/Linux: 'sudo systemctl start mongod'

# 4. Seed the database with sample data
node seed.js

# 5. Start the server
npm start

# 6. Open in browser
# http://localhost:3000
```

### Admin Login

After seeding, use these credentials to access the admin panel:

| Field | Value |
|-------|-------|
| URL | http://localhost:3000/admin/login |
| Username | `admin` |
| Password | `admin123` |

## 📁 Project Structure

```
mother-teresa-school/
├── config/db.js          # MongoDB connection
├── middleware/auth.js     # Admin auth middleware
├── models/               # Mongoose models
│   ├── Admin.js
│   ├── Admission.js
│   ├── Contact.js
│   ├── Gallery.js
│   └── Notice.js
├── public/
│   ├── css/style.css     # Custom styles
│   ├── js/main.js        # Client-side JS
│   └── images/uploads/   # Uploaded images
├── routes/
│   ├── admin.js          # Admin routes
│   ├── api.js            # Form submission APIs
│   └── pages.js          # Public page routes
├── views/
│   ├── admin/            # Admin EJS templates
│   ├── partials/         # Header & footer
│   ├── index.ejs         # Home page
│   └── ...               # Other pages
├── .env                  # Environment variables
├── package.json
├── seed.js               # Database seeder
└── server.js             # App entry point
```

## 🌐 Deployment

### Deploy to Render (Free)

1. Push code to **GitHub**
2. Create a **MongoDB Atlas** database (free tier) at [mongodb.com/atlas](https://www.mongodb.com/atlas)
3. Sign up at [render.com](https://render.com)
4. Create a **New Web Service** → connect your GitHub repo
5. Set environment variables:
   - `MONGO_URI` = your Atlas connection string
   - `SESSION_SECRET` = a random secret string
   - `PORT` = 3000
6. Build command: `npm install`
7. Start command: `node server.js`

### Deploy to Vercel

> Note: Vercel is optimized for serverless; Render is recommended for this Express app.

### Deploy to AWS

1. Launch an EC2 instance (Ubuntu)
2. Install Node.js and MongoDB
3. Clone repo, run `npm install` and `node seed.js`
4. Use PM2 for process management: `pm2 start server.js`
5. Set up Nginx as reverse proxy

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/mother_teresa_school` |
| `SESSION_SECRET` | Express session secret | `motherTeresaSchool2024SecretKey` |
| `PORT` | Server port | `3000` |

## 📄 License

This project is for educational purposes. © Mother Teresa Public School, Mahnar.
