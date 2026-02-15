import { Server } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: any) => {
    io = new Server(httpServer, {
        cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" }
    });

    io.on('connection', (socket) => {
        socket.on('join', (userId) => {
            socket.join(userId); // Join a private room for the user
        });
    });
};

export const notifyUser = (userId: string, data: any) => {
    if (io) io.to(userId).emit('ai-suggestion', data);
};