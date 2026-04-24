import { Response } from 'express';
import FriendRequestNotificationDTO from "../../../application/dtos/FriendRequestNotificationDTO";
import FriendRequestNotifier from '../../../application/services/FriendRequestNotifier';
import IFriendRequestConnectionManager from '../interfaces/IFriendRequestConnectionManager';

export default class SseFriendRequestManager implements FriendRequestNotifier, IFriendRequestConnectionManager {
    // Mapa exclusivo para conexiones de solicitudes de amistad
    private clients: Map<string, Response> = new Map();

    addClient(userId: string, res: Response): void {
        this.clients.set(userId, res);
    }

    removeClient(userId: string): void {
        this.clients.delete(userId);
    }

    // Método que llamará tu UseCase
    notifyNewRequest(userId: string, payload: FriendRequestNotificationDTO): void {
        const clientResponse = this.clients.get(userId);
        
        if (clientResponse) {
            // Ya no necesitamos el "event:", solo mandamos la data directa
            clientResponse.write(`data: ${JSON.stringify(payload)}\n\n`); 
        }
    }

    notifyRequestAccepted(userId: string, payload: any): void {
        const clientResponse = this.clients.get(userId);
        if (clientResponse) {
            // Mandamos un campo tipo dentro del JSON para que Android sepa qué hacer
            const dataString = JSON.stringify({ action: 'ACCEPTED', data: payload });
            clientResponse.write(`data: ${dataString}\n\n`); 
        }
    }
}