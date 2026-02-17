import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import Swal from 'sweetalert2';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
    const { user } = useAuth();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!user) return;
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
            autoConnect: true,
        });

        socketRef.current.emit('join', user.id);

        socketRef.current.on('connect_error', (err) => {
        });

        socketRef.current.on('ai-suggestion', (data: any) => {
            setTimeout(() => {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });

                Toast.fire({
                    icon: 'info',
                    title: 'AI Suggestion',
                    text: data.message
                });
            }, 2000);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [user]);

    return socketRef.current;
};
