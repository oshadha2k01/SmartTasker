'use client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Sign Out?',
            text: 'Are you sure you want to end your session?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Sign Out',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-xl',
                cancelButton: 'rounded-xl'
            }
        });

        if (result.isConfirmed) {
            logout();
            router.push('/login');
        }
    };

    const userDisplayName = user?.name || user?.email?.split('@')[0] || 'User';

    return (
        <header className="sticky top-0 z-40 w-full transition-all duration-300 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 group transition-opacity hover:opacity-90"
                >
                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                        Smart<span className="text-indigo-600">Tasker</span>
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200/60">

                            <div className="relative group">
                                <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-sm cursor-pointer transition-transform hover:scale-105">
                                    <div className="h-full w-full bg-gradient-to-tr from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                        {userDisplayName.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="ml-2 group relative flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                title="Sign Out"
                            >
                                <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="group flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                        >
                            <User className="h-4 w-4 text-slate-300 transition-colors group-hover:text-white" />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
