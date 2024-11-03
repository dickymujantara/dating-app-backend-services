# Dating App Backend Service

This is a backend service that handles user authentication, chat functionalities, and swipe interactions. It is built using TypeScript, Express, and MongoDB.

# Postman Collections

`https://api.postman.com/collections/6626098-0b952aaa-e07a-45b9-a15f-a8c7a960d9e1?access_key=${access_key}`

# Project Structure

```plaintext
dating-app-backend-service/
│
├── src/
│   ├── index.ts                       # Main entry point for the application
│   ├── connections/                   # Database connection setup
│   │   └── dbConnections.ts           # MongoDB or other database connection logic
│   │
│   ├── controllers/                   # Controllers for handling requests
│   │   ├── authControllers.ts         # Logic for authentication (login, registration)
│   │   ├── chatController.ts          # Logic for chat functionalities
│   │   └── userController.ts          # Logic for user management (profile operations)
│   │
│   ├── middleware/                    # Middleware for request processing
│   │   ├── authMiddleware.ts          # Authentication checks for routes
│   │   └── errorMiddleware.ts         # Centralized error handling
│   │
│   ├── models/                        # Mongoose models or database schemas
│   │   ├── Chat.ts                    # Chat message schema
│   │   ├── ChatRoom.ts                # Chat room schema
│   │   ├── Swipe.ts                   # Swipe interaction schema
│   │   └── User.ts                    # User profile schema
│   │
│   ├── routes/                        # Route definitions
│   │   ├── authRouter.ts              # Routes for authentication
│   │   ├── userRouter.ts              # Routes for user operations
│   │   └── chatRouter.ts              # Routes for chat functionalities
│   │
│   └── utils/                        # Utility functions
│       └── auth.ts                    # Authentication helper functions
│
├── .env                                # Environment variables
├── package.json                        # Project metadata and dependencies
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # Documentation file
```

## Instructions to Run the Service

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/my-backend-service.git
   cd my-backend-service
   ```

2. **Install Dependencies**:
   `npm i`

3. **Set Up Environment Variables**:

   ```
   PORT=8000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   MONGODB_URI=mongodb://your_mongo_db_uri
   ```

4. **Set Up Environment Variables**:
   `npm run dev`
