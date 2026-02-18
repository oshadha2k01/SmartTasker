import { Server } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: any) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        socket.on('join', (userId) => {
            socket.join(userId);
        });
    });
};

export const notifyUser = (userId: string, data: any) => {
    if (io) io.to(userId).emit('ai-suggestion', data);
};

export const sendNotification = (userId: string, event: string, data: any) => {
    if (io) io.to(userId).emit(event, data);
};