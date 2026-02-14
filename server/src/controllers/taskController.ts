// server/src/controllers/taskController.ts
import { Response } from 'express';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';
import axios from 'axios';
import { notifyUser } from '../services/socketService';

export const getTasks = async (req: AuthRequest, res: Response) => {
    const tasks = await Task.find({ user: req.user?.id }); // Ownership enforced
    res.json(tasks);
};

export const updateTask = async (req: AuthRequest, res: any) => {
    const task = await Task.findById(req.params.id);

    // Security Check: Does the user own this task?
    if (!task || task.user.toString() !== req.user?.id) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // 1. Create task in DB (Core Requirement)
        const task = await Task.create({ ...req.body, user: req.user.id });

        // 2. Call Python AI Microservice (Novelty Feature)
        try {
            // Check if the AI service URL is defined, fallback to localhost:8000
            const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
            const aiResponse = await axios.post(`${aiServiceUrl}/predict-priority`, {
                description: task.description
            });

            // 3. Push Real-time Notification via WebSockets
            notifyUser(req.user.id, {
                taskId: task._id,
                suggestion: aiResponse.data.priority,
                message: `AI suggests a ${aiResponse.data.priority} priority for this task.`
            });
        } catch (aiErr) {
            console.error("AI Service connection failed or returned error:", aiErr);
            // We don't fail the task creation if AI fails, just log it.
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

        // Optionally, you could save these tasks automatically, or just return them for confirmation
        // For this feature, we'll return them so the frontend can display them for the user to confirm/add.

        res.json({ tasks: generatedTasks });

    } catch (error: any) {
        console.error("AI Task Generation failed:", error);
        res.status(500).json({ message: "Failed to generate tasks from text" });
    }
};