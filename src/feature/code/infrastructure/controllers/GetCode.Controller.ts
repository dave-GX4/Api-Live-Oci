import { Request, Response } from "express";
import InvalidError from "../../../../core/errors/InvalidError";
import GetFriendCodeUseCase from "../../application/usecases/GetFriendCode.UseCase";
import SseConnectionManager from "../services/impl/SseConnectionManager";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import IConnectionManager from "../services/interfaces/IConnectionManager";

export default class GetCodeController {
    constructor(
        private readonly getFriendCodeUseCase: GetFriendCodeUseCase,
        private readonly sseManager: IConnectionManager
    ) {}

     async streamCode(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            if (!id) throw new InvalidError("No se encontró tu identificador");

            // Headers
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            this.sseManager.addClient(id, res);

            // Enviar el código actual inmediatamente al abrir la pantalla
            const currentCode = await this.getFriendCodeUseCase.execute(id);
            if (currentCode) {
                res.write(`data: ${JSON.stringify(currentCode)}\n\n`);
            }

            // HEARTBEAT PARA RAILWAY
            // Enviamos un comentario SSE (:) cada 30 segundos
            const heartbeatInterval = setInterval(() => {
                res.write(':\n\n'); 
            }, 30000); 

            // PREVENIR MEMORY LEAKS AL CERRAR
            req.on('close', () => {
                console.log(`Cliente desconectado: ${id}`);
                // Detener el reloj (interval) para liberar RAM
                clearInterval(heartbeatInterval); 
                // Eliminar al usuario del mapa
                this.sseManager.removeClient(id);
            });

        } catch (error) {
            if (!res.headersSent) {
                if (error instanceof InvalidError) {
                    res.status(400).json({ error: error.message });
                } else if (error instanceof DatabaseOperationError) {
                    res.status(500).json({ error: "Error en la base de datos" });
                } else {
                    res.status(500).json({ error: "Error interno del servidor" });
                }
            } else {
                console.error("Error en el stream SSE:", error);
                res.write(`data: {"error": "Error interno"}\n\n`);
                res.end();
            }
        }
    }
}