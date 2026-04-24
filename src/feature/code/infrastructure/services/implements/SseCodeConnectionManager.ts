import { Response } from "express";
import FriendCodeUpdateDTO from "../../../application/dtos/FriendCodeUpdateDTO";
import FriendCodeNotifier from "../../../application/services/FriendCodeNotifier";
import IConnectionManager from "../interfaces/ICodeConnectionManager";

export default class SseCodeConnectionManager implements FriendCodeNotifier, IConnectionManager {
    // Ahora TypeScript sabe que este Response es de Express
    private clients: Map<string, Response> = new Map();

    notifyCodeUpdated(userId: string, payload: FriendCodeUpdateDTO): void {
        const clientResponse = this.clients.get(userId);
        
        if (clientResponse) {
            const dataString = JSON.stringify(payload);
            clientResponse.write(`data: ${dataString}\n\n`); 
        }
    }

    addClient(userId: string, res: Response): void {
        this.clients.set(userId, res);
    }

    removeClient(userId: string): void {
        this.clients.delete(userId);
    }
}