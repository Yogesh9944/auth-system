🔐 Authentication System API

A secure authentication system built using Node.js, Express, MongoDB, and JWT.
This project demonstrates industry-standard authentication practices including password hashing, token-based authentication, and protected routes.

🚀 Features

✔ User Registration
✔ User Login Authentication
✔ Password Hashing using bcrypt
✔ JWT Access Token Authentication
✔ Refresh Token Mechanism
✔ Protected Routes Middleware
✔ Secure User Data Handling
✔ Clean MVC Project Structure

🛠 Tech Stack

Backend
Node.js
Express.js
Database
MongoDB
Mongoose

Authentication & Security

JSON Web Tokens (JWT)
bcrypt

📂 Project Structure
auth-system
│
├── config
│   ├── db.js
│   └── jwt.js
│
├── controllers
│   └── authController.js
│
├── middleware
│   └── verifyToken.js
│
├── models
│   └── User.js
│
├── routes
│   └── authRoutes.js
│
├── server.js
├── package.json
├── .env
└── README.md
⚙️ Installation

Clone the repository
git clone https://github.com/YOUR_USERNAME/auth-system-api.git
Go to project folder
cd auth-system-api

Install dependencies

npm install
🔑 Environment Variables
Create a .env file in the root directory and add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
▶️ Running the Server

Start the development server
npm run dev

or

node server.js
Server will start on:

http://localhost:5000
📌 API Endpoints
Register User
POST /api/auth/register
Login User
POST /api/auth/login
Get Current User (Protected)
GET /api/auth/me
Refresh Access Token
POST /api/auth/refresh
🔒 Authentication Flow

User registers with email and password.
Password is hashed using bcrypt.
User logs in and receives:
Access Token
Refresh Token
Access token is used to access protected routes.
Refresh token is used to generate new access tokens.

📸 Example Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123456",
      "username": "yogesh",
      "email": "yogesh@example.com"
    },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
🎯 Learning Outcomes

This project helped in understanding:
Backend project structure (MVC)
JWT authentication flow
Password security best practices
Middleware implementation

REST API development

👨‍💻 Author

Yogesh Pande
Aspiring Backend Developer | Full Stack Developer

⭐ Future Improvements

Email verification system
Password reset functionality
Rate limiting for security
Refresh token storage in database

Role-based access control (RBAC)

⭐ If you like this project, consider giving it a star on GitHub!