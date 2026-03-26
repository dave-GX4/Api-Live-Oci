import UUID from "../../../../core/valueobjects/UUID";
import ActivitiesRepository from "../../domain/Activities.Repository";
import GetResponseDto from "../dto/GetResponseDto";

export default class GetAllActivitiesByUserUseCase{
    constructor(
        private readonly repository : ActivitiesRepository
    ){}

    async run(idUser: string): Promise<GetResponseDto[]> {
        const userId = UUID.validate(idUser);

        const results = await this.repository.getAllActivitiesByUser(userId.getValue());

        return results.map(result => ({
            uuid: result.uuid.getValue(),
            name: result.name,
            description: result.description,
            type: result.type,
            category: result.category,
            durationMinutes: result.durationMinutes,
            socialType: result.socialType
        }));
    }
}