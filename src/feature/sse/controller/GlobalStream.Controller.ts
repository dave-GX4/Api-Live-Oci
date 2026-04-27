import { Response } from 'express';
import IGlobalConnectionManager from '../../../core/services/interface/I.GlobalConnectionManager';
import FriendCodeNotifier from '../../code/application/services/FriendCodeNotifier';
import FriendRequestNotifier from '../../friend/application/services/FriendRequestNotifier';
import Notification from '../../notifications/domain/entity/Notification';

export default class GlobalSseManager implements IGlobalConnectionManager, FriendCodeNotifier, FriendRequestNotifier {
    private clients: Map<string, Set<Response>> = new Map();

    addClient(userId: string, res: Response): void {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, new Set());
        }
        
        this.clients.get(userId)!.add(res);
        console.log(`[Global SSE] Cliente conectado. Usuario: ${userId}. Conexiones activas : ${this.clients.get(userId)!.size}`);
    }

    removeClient(userId: string, res: Response): void {
        const userClients = this.clients.get(userId);
        
        if (userClients) {
            userClients.delete(res);
            console.log(`[Global SSE] Cliente desconectado. Usuario: ${userId}. Conexiones restantes : ${userClients.size}`);
            
            if (userClients.size === 0) {
                this.clients.delete(userId);
            }
        }
    }

    // IMPLEMENTACIÓN DE CÓDIGOS
    notifyCodeUpdated(userId: string, payload: any): void {
        const userClients = this.clients.get(userId);
        if (userClients) {
            userClients.forEach(client => {
                client.write(`event: CODE_UPDATED\n`);
                client.write(`data: ${JSON.stringify(payload)}\n\n`); 
            });
        }
    }

    // SOLICITUDES DE AMISTAD
    notifyNewRequest(userId: string, payload: Notification): void {
        const userClients = this.clients.get(userId);
        if (userClients) {
            userClients.forEach(client => {
                client.write(`event: FRIEND_REQUEST_NEW\n`);
                client.write(`data: ${JSON.stringify(payload)}\n\n`); 
            });
        }
    }

    // AÑADIR O ELIMINAR AMIGO
    notifyFriendAdded(userId: string, payload: any): void {
        const userClients = this.clients.get(userId);
        if (userClients) {
            userClients.forEach(client => {
                client.write(`event: FRIEND_LIST_UPDATED\n`); 
                client.write(`data: ${JSON.stringify(payload)}\n\n`); 
            });
        }
    }
}