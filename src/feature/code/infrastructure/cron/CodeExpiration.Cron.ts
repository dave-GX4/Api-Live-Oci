import cron from 'node-cron';
import RegenerateFriendCodeUseCase from "../../application/usecases/RegenerateFriendCode.UseCase";
import CodeRepository from "../../domain/Code.Repository";

export class CodeExpirationCron {
    constructor(
        private readonly regenerateUseCase: RegenerateFriendCodeUseCase,
        private readonly repository: CodeRepository
    ) {}

    start(): void {
        // Ejecutar cada hora (cambiarlo a '* * * * *' para cada minuto mientras pruebas)
        cron.schedule('* * * * *', async () => {
            console.log("Ejecutando Cron de expiración de códigos...");
            
            try {
                // Obtenemos la fecha y hora actual
                const ahora = new Date();

                // Le pedimos al repo la lista REAL de usuarios expirados
                const expiredUserIds = await this.repository.getExpiredUsersIds(ahora);

                if (expiredUserIds.length === 0) {
                    console.log("No hay códigos expirados en este momento.");
                    return;
                }

                // Ejecutar el caso de uso por cada usuario que expiró
                for (const userId of expiredUserIds) {
                    try {
                        await this.regenerateUseCase.execute(userId);
                        console.log(`[EXITO] Código regenerado para ${userId}`);
                    } catch (error) {
                        console.error(`[ERROR] regenerando código para ${userId}`, error);
                    }
                }
            } catch (error) {
                console.error("Error fatal ejecutando la consulta del Cron", error);
            }
        });
    }
}