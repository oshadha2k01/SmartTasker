'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskFormData } from '@/lib/validations';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated: () => void;
    token: string;
}

export default function TaskModal({ isOpen, onClose, onTaskCreated, token, taskToEdit }: { isOpen: boolean; onClose: () => void; onTaskCreated: () => void; token: string; taskToEdit?: TaskFormData & { id: string } | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: taskToEdit ? {
            title: taskToEdit.title,
            description: taskToEdit.description,
            status: taskToEdit.status
        } : {
            status: 'pending'
        }
    });

    useEffect(() => {
        if (taskToEdit) {
            reset({
                title: taskToEdit.title,
                description: taskToEdit.description,
                status: taskToEdit.status,
                deadline: taskToEdit.deadline ? new Date(new Date(taskToEdit.deadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''
            });
        } else {
            reset({
                title: '',
                description: '',
                status: 'pending',
                deadline: ''
            });
        }
    }, [taskToEdit, reset]);

    const onSubmit = async (data: TaskFormData) => {
        setIsSubmitting(true);
        try {
            const url = taskToEdit
                ? `http://localhost:5000/tasks/${taskToEdit.id}`
                : 'http://localhost:5000/tasks';

            const method = taskToEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: taskToEdit ? 'Task Updated' : 'Task Created',
                    text: taskToEdit ? 'Your task has been updated successfully' : 'Your new task has been added successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                reset();
                onTaskCreated();
                onClose();
            } else if (res.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Session Expired',
                    text: 'Please login again to continue.',
                    confirmButtonText: 'Login'
                }).then(() => {
                    window.location.href = '/login';
                });
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || (taskToEdit ? 'Failed to update task' : 'Failed to create task'));
            }
        } catch (error: any) {
            console.error('Error saving task:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Something went wrong',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100 p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            {...register('title')}
                            className={`block w-full px-4 py-3 rounded-xl border transition-all duration-200 text-gray-900 placeholder-gray-400 ${errors.title
                                ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50/50'
                                : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 focus:bg-white'
                                }`}
                            placeholder="e.g., Bug fix"
                        />
                        {errors.title && (
                            <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            {...register('description')}
                            rows={4}
                            className={`block w-full px-4 py-3 rounded-xl border transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none ${errors.description
                                ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50/50'
                                : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 focus:bg-white'
                                }`}
                            placeholder="Add details about your task..."
                        />
                        {errors.description && (
                            <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                                <span>•</span> {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            {...register('status')}
                            className={`block w-full px-4 py-3 rounded-xl border transition-all duration-200 text-gray-900 ${errors.status
                                ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50/50'
                                : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 focus:bg-white'
                                }`}
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                        {errors.status && (
                            <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                                <span>•</span> {errors.status.message}
                            </p>
                        )}
                    </div>

                    {/* Deadline Field */}
                    <div className="space-y-2">
                        <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700">
                            Deadline
                        </label>
                        <input
                            id="deadline"
                            type="datetime-local"
                            {...register('deadline')}
                            className={`block w-full px-4 py-3 rounded-xl border transition-all duration-200 text-gray-900 placeholder-gray-400 ${errors.deadline
                                ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50/50'
                                : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 focus:bg-white'
                                }`}
                        />
                        {errors.deadline && (
                            <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                                <span>•</span> {errors.deadline.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-3 text-sm font-medium text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md ${taskToEdit ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {taskToEdit ? 'Updating...' : 'Creating...'}
                                </span>
                            ) : (
                                taskToEdit ? 'Update Task' : 'Create Task'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
