import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { initSocket } from './services/socketService';

// Load environment variables 
dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap Express app with HTTP server
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser [cite: 54]
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Basic Route for Testing
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Global Error Handler (No stack trace leaks) 
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'An internal server error occurred'
            : err.message
    });
});

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});