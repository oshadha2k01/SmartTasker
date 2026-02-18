import { Response } from 'express';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';
import axios from 'axios';
import { notifyUser } from '../services/socketService';

export const getTasks = async (req: AuthRequest, res: Response) => {
    console.log(`Getting tasks for user: ${req.user?.id}`);
    try {
        const tasks = await Task.find({ user: req.user?.id });
        console.log(`Found ${tasks.length} tasks`);
        res.status(200).json(tasks);
    } catch (err: any) {
        console.error('Error in getTasks:', err);
        res.status(500).json({ message: 'Server error retrieving tasks' });
    }
};

export const updateTask = async (req: AuthRequest, res: any) => {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user?.id) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    const updateData = { ...req.body };
    if (req.body.deadline) {
        updateData.notificationSent = false;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedTask);
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const task = await Task.create({ ...req.body, user: req.user.id });

        try {
            const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
            const aiResponse = await axios.post(`${aiServiceUrl}/predict-priority`, {
                description: task.description
            });

            notifyUser(req.user.id, {
                taskId: task._id,
                suggestion: aiResponse.data.priority,
                message: `AI suggests a ${aiResponse.data.priority} priority for this task.`
            });
        } catch (aiErr) {
            console.error("AI Service connection failed or returned error:", aiErr);
        }

        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user?.id) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const generateTasksFromText = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const { text } = req.body;
        if (!text) {
            res.status(400).json({ message: 'Text input is required' });
            return;
        }

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        const aiResponse = await axios.post(`${aiServiceUrl}/generate-tasks`, {
            text: text
        });

        const generatedTasks = aiResponse.data;

        res.json({ tasks: generatedTasks });

    } catch (error: any) {
        console.error("AI Task Generation failed:", error);
        res.status(500).json({ message: "Failed to generate tasks from text" });
    }
};