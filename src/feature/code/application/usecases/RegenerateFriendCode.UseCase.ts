import CodeService from "../../../../core/services/interface/codeService";
import CodeRepository from "../../domain/Code.Repository";
import FriendCodeUpdateDTO from "../dtos/FriendCodeUpdateDTO";
import FriendCodeNotifier from "../services/FriendCodeNotifier";

export default class RegenerateFriendCodeUseCase {
    constructor(
        private readonly codeRepository: CodeRepository,
        private readonly codeGeneratorService: CodeService,
        private readonly notifier: FriendCodeNotifier
    ) {}

    async execute(userId: string): Promise<void> {
        // Verificar que el usuario ya tenga un registro previo
        const existingCode = await this.codeRepository.getCodeByUser(userId);
        if (!existingCode) {
            throw new Error("No existe un código previo para actualizar.");
        }

        // Generar el nuevo código y fechas usando tu servicio core
        const newCodeString = await this.codeGeneratorService.generateUniqueCode();
        const newExpiration = this.codeGeneratorService.calculateExpirationDate();
        const regeneratedAt = new Date();

        // Preparar los datos de actualización
        const updateData = {
            code: newCodeString,
            expiresAt: newExpiration,
            regeneratedAt: regeneratedAt
        };

        // Actualizar en la base de datos
        await this.codeRepository.updateCodeUser(userId, updateData);

        const dto: FriendCodeUpdateDTO = {
            code: newCodeString,
            expires_at: newExpiration,
            regenerated_at: regeneratedAt
        };

        // Notificar al usuario. 
        // Si el usuario está conectado por SSE, la capa de infraestructura lo recibirá y lo enviará al frontend.
        // Si no está conectado, la infraestructura simplemente lo ignorará.
        this.notifier.notifyCodeUpdated(userId, dto);
    }
}