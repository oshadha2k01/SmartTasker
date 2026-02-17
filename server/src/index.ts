import 'dotenv/config'; // Load env vars before anything else
import mongoose from 'mongoose';
import http from 'http';
import { initSocket } from './services/socketService';
import app from './app';

const server = http.createServer(app); // Wrap Express app with HTTP server
const PORT = process.env.PORT || 5000;

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
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});