import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import Email from "../../../../core/valueobjects/Email";
import Password from "../../../../core/valueobjects/Password";
import UUID from "../../../../core/valueobjects/UUID";
import UserRepository from "../../domain/User.Repository";
import UserResponseDTO from "../dto/UserResponseDto";

export default class UpdateUserUseCase{
    constructor(
        private readonly repository : UserRepository
    ){}

    async run(
        id: string,
        leisure_type: string,
        email?: string,
        password?: string,
        notifications?: boolean,
        interests?: string,
        topics?: string,
        description?: string,
    ): Promise<UserResponseDTO>{
        const idValue = UUID.validate(id);

        const user = await this.repository.getByIdUser(idValue.getValue());

        if (!user) throw new NotFoundError("No se encontro la información");

        if(idValue != user.id){
            throw new InvalidError("No tienes permisos para modificar estos datos")
        }

        const updates: any = {};
        
        updates.leisure_type = leisure_type === user.leisure_type ? null : leisure_type;
        
        if (email) updates.email = Email.validated(email).getValue();
        if (password) updates.password = Password.validated(password).getValue();
        if (notifications !== undefined) updates.notificactions = notifications;
        if (interests) updates.interests = interests;
        if (topics) updates.topics = topics;
        if (description) updates.description = description;

        await this.repository.updateUser(idValue.getValue(), updates);

        return{
            message: "",
            status: 200
        }
    }
}