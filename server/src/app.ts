import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/auth', limiter);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

export default app;