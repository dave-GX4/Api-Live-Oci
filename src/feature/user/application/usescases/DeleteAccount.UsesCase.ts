import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";
import UserRepository from "../../domain/User.Repository";
import UserResponseDTO from "../dto/UserResponseDto";

export default class DeleteAccountUseCase{
    constructor(
        private readonly repository : UserRepository
    ){}

    async run(id: string): Promise<UserResponseDTO>{
        const idValue = UUID.validate(id);

        const result = await this.repository.getByIdUser(idValue.getValue());

        if(!result){
            throw new NotFoundError("No se pudo encontrar nadie: El usuario no existe");
        }

        if(id != result.id.getValue()){
            throw new InvalidError("No tienes acturizacion para esta cuenta");
        }

        await this.repository.deleteAccount(result.id.getValue())

        return {
            message: "Se a eliminado la cuenta correctamente te extrañaremos :>",
            status: 200
        }
    }
}