import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-zA-Z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

export type AuthFormData = z.infer<typeof authSchema>;

export const taskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().optional(),
    status: z.enum(['pending', 'completed']),
    deadline: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
