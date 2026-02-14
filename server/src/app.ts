// server/src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();

// 1. Security Headers (Requirement: Phase 2 Client Security)
app.use(helmet());

// 2. Rate Limiting (Requirement: Phase 3 Required Security)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/auth', limiter);

// 3. General Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// 4. Endpoints
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// 5. Global Error Handler (Requirement: No stack trace leaks)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

export default app;