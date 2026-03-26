import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";
import UserRepository from "../../domain/User.Repository";
import GetResponseUserDto from "../dto/GetResponseUserDto";

export default class GetByIdUserUseCase{
    constructor(
        private readonly repository : UserRepository
    ){}

    async run(id: string): Promise<GetResponseUserDto>{
        const idValue = UUID.validate(id);

        const user = await this.repository.getByIdUser(idValue.getValue())

        if(!user){
            throw new NotFoundError("La informacion no se encontro")
        }

        return {
            name: user.name,
            email: user.email.getValue(),
            notifications: !!user.notifications,
            interests: user.interests,
            topics: user.topics,
            description: user.description,
            leisureType: user.leisureType
        };
    }
}