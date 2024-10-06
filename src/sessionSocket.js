import io from 'socket.io-client';
import { endpoint } from './Config/Constant';

export const sessionSocket = io(endpoint, {
    transports: ['websocket'], // Prefer WebSocket transport
    withCredentials: true // Include credentials if necessary
});