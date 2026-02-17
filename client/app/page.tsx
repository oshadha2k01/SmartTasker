'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import TaskCard, { Task } from '@/components/TaskCard';
import Swal from 'sweetalert2';
import { FileText } from 'lucide-react';
import TaskModal from '@/components/TaskModal';

export default function Home() {
  const { user, token } = useAuth();
  useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else if (res.status === 401) {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [user, token, fetchTasks]);

  const handleAction = (action: string) => {
    if (!user) {
      Swal.fire({
        title: 'Authentication Required',
        text: `Please login to ${action}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
    } else if (action === 'create a new task') {
      setEditingTask(null);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskCreated = () => {
    fetchTasks();
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskDeleted = () => {
    fetchTasks();
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-end items-center">
          <button
            onClick={() => handleAction('create a new task')}
            className="flex justify-end rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + New Task
          </button>
        </div>

        <div className="space-y-6">
          {!user ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-gray-500">Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleTaskEdit}
                  onDelete={handleTaskDeleted}
                  token={token}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 transition-colors">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && user && token && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onTaskCreated={handleTaskCreated}
          token={token}
          taskToEdit={editingTask as any}
        />
      )}
    </div>
  );
}
