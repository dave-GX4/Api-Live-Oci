import UUID from "../../../../core/valueobjects/UUID";
import ActivitiesRepository from "../../domain/Activities.Repository";
import GetResponseDto from "../dto/GetResponseDto";

export default class GetAllActivitiesByUserUseCase{
    constructor(
        private readonly repository : ActivitiesRepository
    ){}

    async run(id_user: string): Promise<GetResponseDto[]> {
        const userId = UUID.validate(id_user);

        const results = await this.repository.getAllActivitiesByUser(userId.getValue());

        return results.map(result => ({
            id: result.id.getValue(),
            name: result.name,
            description: result.description,
            type: result.type,
            category: result.category,
            duration_minutes: result.duration_minutes,
            social_type: result.social_type
        }));
    }
}