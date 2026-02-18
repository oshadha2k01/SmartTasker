import 'dotenv/config';
import mongoose from 'mongoose';
import http from 'http';
import { initSocket } from './services/socketService';
import { startScheduler } from './services/scheduler';
import app from './app';

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

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

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

initSocket(server);

startScheduler();

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});