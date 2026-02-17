'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, AuthFormData } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema)
    });

    const onSubmit = async (data: AuthFormData) => {
        try {
            const res = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            if (res.ok) {
                // Registration successful
                Swal.fire({
                    title: 'Registration Successful!',
                    text: 'Please login to continue.',
                    icon: 'success',
                    confirmButtonText: 'Go to Login'
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push('/login');
                    }
                });
            } else {
                Swal.fire({
                    title: 'Registration Failed',
                    text: result.message || 'Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (error) {
            console.error("Registration failed", error);
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 px-4 py-12">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 space-y-8 transform transition-all duration-300 hover:shadow-3xl">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            Create an Account
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">Join SmartTasker and get started</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    placeholder="you@example.com"
                                    className={`block w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 ${errors.email
                                        ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                                        : 'border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                                    <span></span> {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    placeholder="Create a strong password"
                                    className={`block w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50/50 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 ${errors.password
                                        ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                                        : 'border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                                    <span>•</span> {errors.password.message}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full group relative overflow-hidden bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Create Account
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                    <div className="pt-4 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
