const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const userRouter = require('./route/user.route.js');

const app = express();

// CORS setup
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL  // Ensure this is set correctly in .env
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
    const fs = require('fs');
    const path = require('path');
    const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream: logStream }));
} else {
    app.use(morgan('dev'));
}
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }  // Adjust according to your security needs
}));

// Routes
app.use('/api/users', userRouter);  // Use '/api/users' for user routes

// Database connection and server start
connectDB().then(() => {
    const server = app.listen(process.env.PORT || 8080, () => {
        console.log("Server is running on port", process.env.PORT || 8080);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('SIGINT signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            mongoose.connection.close(() => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    });
}).catch((error) => {
    console.error("Database connection error:", error);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});