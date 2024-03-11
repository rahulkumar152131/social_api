// Importing environment variables from env.js
import "./env.js";

// Importing necessary modules and middleware
import express from "express";
import swagger from "swagger-ui-express";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import cors from 'cors';

// Importing routers and middleware
import userRouter from "./src/features/user/user.router.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import apiDocs from './swagger3.0.json' assert{type: 'json'};
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectUsingMongoose } from "./src/config/mongooseMongodb.js";
import postRouter from "./src/features/post/post.router.js";
import rateLimit from "express-rate-limit";

// Creating an Express server instance
const server = express();

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again later',
});

server.use(limiter);

// Setting up CORS to allow requests from http://localhost:8000
server.use(cors({
    origin: 'http://localhost:8000',
}));

// Serving static files from the 'uploads' directory
server.use('/uploads', express.static('uploads'));

// Using cookie parser and JSON body parser middleware
server.use(cookieParser());
server.use(bodyParser.json());

// Enabling URL-encoded parsing
server.use(express.urlencoded({ extended: true }));

// Serving API documentation using Swagger UI
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

// Routing for user-related API endpoints
server.use("/api/users", userRouter);

// Routing for post-related API endpoints with JWT authentication
server.use("/api/posts", jwtAuth, postRouter);

// Handling a simple GET request to the root endpoint
server.get('/', (req, res) => {
    res.send('Hello world');
});

// Error handler middleware
server.use((err, req, res, next) => {
    if (err instanceof ApplicationError) {
        // Handling known application errors
        return res.status(err.code).send({ success: false, msg: err.message });
    }
    // Handling other errors with a generic message
    res.status(500).send({ success: false, msg: 'Something went wrong, please try later' });
});

// Handling 404 requests with a custom message
server.use((req, res) => {
    res.status(404).send("API not found");
});

// Starting the server and connecting to MongoDB using Mongoose
server.listen(4100, async () => {
    connectUsingMongoose();
    console.log('Server is listening on port: 4100');
});