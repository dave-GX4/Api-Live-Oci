import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import EncryptService from "../../../../core/services/interface/encryptService";
import Email from "../../../../core/valueobjects/Email";
import Password from "../../../../core/valueobjects/Password";
import UUID from "../../../../core/valueobjects/UUID";
import UserRepository from "../../domain/User.Repository";
import UserResponseDTO from "../dto/UserResponseDto";

export default class UpdateUserUseCase{
    constructor(
        private readonly repository : UserRepository,
        private readonly encryptService: EncryptService
    ){}

    async run(
        id: string,
        leisureType?: string,
        email?: string,
        password?: string,
        notifications?: boolean,
        interests?: string[],
        topics?: string[],
        description?: string,
    ): Promise<UserResponseDTO> {
        const idValue = UUID.validate(id);

        const user = await this.repository.getByIdUser(idValue.getValue());

        if (!user) {
            throw new NotFoundError("Usuario", id, "UUID");
        }

        if (idValue.getValue() !== user.uuid.getValue()) {
            throw new InvalidError("No tienes permisos para modificar estos datos");
        }

        const updates: any = {};

        if (leisureType !== undefined && leisureType !== user.leisureType) {
            updates.leisureType = leisureType;
        }
        if (email !== undefined && email !== user.email.getValue()) {
            updates.email = Email.validated(email).getValue();
        }
        if (password !== undefined) {
            const pwd = Password.validated(password);
            const hashed = await this.encryptService.hash(pwd.getValue());
            updates.password = hashed;
        }
        if (notifications !== undefined && notifications !== user.notifications) {
            updates.notifications = notifications;
        }
        if (interests !== undefined) {
            updates.interests = interests;
        }
        if (topics !== undefined) {
            updates.topics = topics;
        }
        if (description !== undefined && description !== user.description) {
            updates.description = description;
        }

        if (Object.keys(updates).length > 0) {
            await this.repository.updateUser(idValue.getValue(), updates);
        }

        return {
            message: "Se actualizaron correctamente tu(s) datos",
            status: 200
        };
    }
}