import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    user: Types.ObjectId; // Reference to the User who owns the task
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Task = model<ITask>('Task', taskSchema);