import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    deadline?: Date;
    notificationSent?: boolean;
    user: Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    deadline: { type: Date },
    notificationSent: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const Task = model<ITask>('Task', taskSchema);