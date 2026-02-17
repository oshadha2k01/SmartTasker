import { Pencil, Trash2, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

export interface Task {
    id: number | string;
    title: string;
    description: string;
    status: 'pending' | 'completed' | string;
    deadline?: string;
}

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
    onDelete?: (taskId: number | string) => void;
    token?: string | null;
}

export default function TaskCard({ task, onEdit, onDelete, token }: TaskCardProps) {
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(task);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const result = await Swal.fire({
            title: 'Delete Task?',
            text: 'Are you sure you want to delete this task? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed && onDelete) {
            if (token) {
                try {
                    const res = await fetch(`http://localhost:5000/tasks/${task.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Task has been deleted successfully.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        onDelete(task.id);
                    } else {
                        throw new Error('Failed to delete task');
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete task. Please try again.',
                    });
                }
            } else {
                onDelete(task.id);
            }
        }
    };

    return (
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300">
            <div className={`absolute top-0 left-0 w-1 h-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-amber-400'
                }`}></div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3 gap-4">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 flex-1 tracking-tight">
                        {task.title}
                    </h3>
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${task.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                            }`}
                    >
                        {task.status}
                    </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3 font-medium">
                    {task.description || "No description provided."}
                </p>

                {task.deadline && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(task.deadline).toLocaleString()}</span>
                    </div>
                )}

                <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0">
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
