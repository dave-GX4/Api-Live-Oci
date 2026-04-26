import { NotFoundError } from "../../../../core/errors/NotFoundError";
import CodeRepository from "../../domain/Code.Repository";
import FriendCode from "../../domain/entity/FriendCode";

export default class GetFriendCodeUseCase {
    constructor(
        private readonly codeRepository: CodeRepository
    ) {}

    async execute(userId: string): Promise<FriendCode> {
        const friendCode = await this.codeRepository.getCodeByUser(userId);
        
        if (!friendCode) {
            throw new NotFoundError("Código de amistad no encontrado para el usuario");
        }

        return friendCode;
    }
}