🛒 ShopSwift – E-Commerce Backend Platform
📌 Overview

ShopSwift is a robust and scalable backend system for an e-commerce shopping platform, designed using Node.js, Express, and MongoDB.
The project focuses on clean API design, role-based authentication, and real-world e-commerce workflows, following the MVC architecture for maintainability and scalability.

It provides separate admin and user modules, enabling efficient product management, secure shopping experiences, and smooth order processing.

🎯 Key Objectives

Build a real-world e-commerce backend from scratch

Implement secure authentication and authorization

Design clean and reusable REST APIs

Practice MVC architecture and backend best practices

🚀 Features
👤 User Features

Secure user registration & login using JWT

Browse products with details and availability

Add, update, and remove items from cart

Place orders and view order history

Protected routes with token-based authentication

🛠️ Admin Features

Admin authentication & authorization

Product CRUD operations

Inventory & stock management

Order tracking and status management

Basic analytics for product and order insights

🧱 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ODM)

Authentication: JWT (JSON Web Tokens)

Architecture: MVC (Model–View–Controller)

API Style: RESTful APIs

🗂️ Folder Structure
shopswift/
├── controllers/     # Business logic
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # Auth & role validation
├── config/          # Database & env config
├── utils/           # Helper functions
├── app.js
└── package.json

🔐 Security & Authorization

JWT-based authentication

Middleware for protected routes

Role-based access control (Admin / User)

Secure handling of sensitive routes

🧪 API Examples

POST /api/auth/register – User registration

POST /api/auth/login – Login & token generation

GET /api/products – Fetch products

POST /api/cart – Cart operations

POST /api/orders – Order placement

POST /api/admin/products – Admin product management

📈 Learning Outcomes

Designed scalable REST APIs

Implemented role-based access control

Worked with MongoDB & Mongoose

Strengthened backend architecture skills

Gained hands-on experience with JWT security

👨‍💻 Author

Yogesh Pant
B.Tech in Information Technology, IIIT Una
📧 yogeshpant942@gmail.com
