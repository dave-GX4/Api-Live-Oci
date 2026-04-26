import { Request, Response } from 'express';
import InvalidError from '../../../core/errors/InvalidError';
import IGlobalConnectionManager from '../../../core/services/interface/I.GlobalConnectionManager';

export default class GlobalStreamController {
    constructor(
        private readonly sseManager: IGlobalConnectionManager,
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

            // Conectamos al usuario al Tubo Global
            this.sseManager.addClient(id, res);

            // Heartbeat para que Railway no corte la conexión (cada 30s)
            const heartbeatInterval = setInterval(() => {
                res.write(':\n\n'); 
            }, 30000); 

            // Cierre seguro
            req.on('close', () => {
                console.log(`[Global SSE] Cliente desconectado: ${id}`);
                clearInterval(heartbeatInterval); 
                this.sseManager.removeClient(id);
            });

        } catch (error) {
            if (!res.headersSent) {
                res.status(500).json({ error: "Error iniciando el stream global" });
            } else {
                res.end();
            }
        }
    }
}