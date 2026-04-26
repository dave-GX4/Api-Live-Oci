import { Response } from 'express';
import FriendCodeNotifier from '../../code/application/services/FriendCodeNotifier';
import FriendRequestNotifier from '../../friend/application/services/FriendRequestNotifier';
import IGlobalConnectionManager from '../../../core/services/interface/I.GlobalConnectionManager';
import Notification from '../../notifications/domain/entity/Notification';

export default class GlobalSseManager implements IGlobalConnectionManager, FriendCodeNotifier, FriendRequestNotifier {
    private clients: Map<string, Response> = new Map();

    addClient(userId: string, res: Response): void {
        this.clients.set(userId, res);
    }

    removeClient(userId: string): void {
        this.clients.delete(userId);
    }

    // IMPLEMENTACIÓN DE CÓDIGOS
    notifyCodeUpdated(userId: string, payload: any): void {
        const client = this.clients.get(userId);
        if (client) {
            client.write(`event: CODE_UPDATED\n`);
            client.write(`data: ${JSON.stringify(payload)}\n\n`); 
        }
    }

    // SOLICITUDES DE AMISTAD
    notifyNewRequest(userId: string, payload: Notification): void {
        const client = this.clients.get(userId);
        if (client) {
            client.write(`event: FRIEND_REQUEST_NEW\n`);
            client.write(`data: ${JSON.stringify(payload)}\n\n`); 
        }
    }

    // AÑADIR O ELIMINAR AMIGO
    notifyFriendAdded(userId: string, payload: any): void {
        const client = this.clients.get(userId);
        if (client) {
            client.write(`event: FRIEND_LIST_UPDATED\n`); 
            client.write(`data: ${JSON.stringify(payload)}\n\n`); 
        }
    }
}