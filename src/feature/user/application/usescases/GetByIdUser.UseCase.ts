import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";
import User from "../../domain/entitie/User";
import UserRepository from "../../domain/User.Repository";

export default class GetByIdUserUseCase{
    constructor(
        private readonly repository : UserRepository
    ){}

    async run(id: string): Promise<User>{
        const idValue = UUID.validate(id);

        const user = await this.repository.getByIdUser(idValue.getValue())

        if(!user){
            throw new NotFoundError("La informacion no se encontro")
        }

        return user;
    }
}