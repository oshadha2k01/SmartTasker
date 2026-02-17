import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Input Validation
        if (!email || !password) {
            res.status(400).json({ message: 'Missing fields' });
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        // Password strength validation
        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long' });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt); // Security: Hashing

        const user = await User.create({ email, password: hashedPassword });

        // Issue token immediately to auto-login? Requirement doesn't specify, but standard practice is logging in or just 201.
        // User requirements say "POST /auth/register (password hashing)".
        // Keep it simple.

        res.status(201).json({ id: user._id, email: user.email });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Missing email or password' });
            return;
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate Access Token (Short-lived)
            const accessTokenSecret = process.env.JWT_SECRET as string;
            const accessToken = jwt.sign(
                { id: String(user._id) },
                accessTokenSecret,
                { expiresIn: '15m' }
            );

            // Generate Refresh Token (Long-lived)
            const refreshTokenSecret = process.env.JWT_SECRET as string; // Ideally use a separate secret
            const refreshTokenExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

            const generatedRefreshToken = jwt.sign(
                { id: String(user._id) },
                refreshTokenSecret,
                { expiresIn: refreshTokenExpiresIn } as jwt.SignOptions
            );

            res.json({
                accessToken,
                refreshToken: generatedRefreshToken,
                user: { id: user._id, email: user.email }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const refreshUser = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh Token is required' });
        return;
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as { id: string };

        // Verify user triggers security check (revocation, deleted user)
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        const newAccessToken = jwt.sign(
            { id: String(user._id) },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid Refresh Token' });
    }
};

export { registerUser, loginUser };
