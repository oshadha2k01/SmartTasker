import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Missing fields' });
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
        res.status(201).json({ id: user._id, email: user.email });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
            res.json({ token, user: { id: user._id, email: user.email } });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
