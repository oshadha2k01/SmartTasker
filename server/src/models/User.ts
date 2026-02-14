import { Schema, model, Document } from 'mongoose';

// interface for TypeScript type checking
export interface IUser extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export const User = model<IUser>('User', userSchema);