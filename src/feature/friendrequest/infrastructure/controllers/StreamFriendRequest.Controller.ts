import { Request, Response } from 'express';
import InvalidError from "../../../../core/errors/InvalidError";
import IFriendRequestConnectionManager from '../services/interfaces/IFriendRequestConnectionManager';

export default class StreamFriendRequestController {
    constructor(
        private readonly sseManager: IFriendRequestConnectionManager,
    ) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            if (!id) throw new InvalidError("No se encontró el identificador del usuario");

            // Cabeceras obligatorias para SSE
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            // Agregamos al usuario al mapa de este canal exclusivo
            this.sseManager.addClient(id, res);

            // Heartbeat para Railway (evita que Railway cierre la conexión inactiva)
            const heartbeatInterval = setInterval(() => {
                res.write(':\n\n'); 
            }, 30000); 

            // Cierre seguro cuando el usuario minimiza o cierra la app en Android
            req.on('close', () => {
                console.log(`[FriendRequests SSE] Cliente desconectado: ${id}`);
                clearInterval(heartbeatInterval); 
                this.sseManager.removeClient(id);
            });

        } catch (error) {
            if (!res.headersSent) {
                res.status(500).json({ error: "Error iniciando el stream de amigos" });
            } else {
                res.end();
            }
        }
    }
}