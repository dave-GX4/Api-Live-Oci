import Bored from "../../domain/entity/Bored";
import BoredResponseDto from "../dto/BoredResponseDto";
import { IBoredService } from "../externalprovider/IBored.Service";

export default class GetActivityByKeyUseCase {
    constructor(private readonly externalBored: IBoredService) {}

    async run(key: number): Promise<BoredResponseDto> {
        const result = await this.externalBored.getActivityByKey(key);
        return this.mapToDto(result);
    }

    private mapToDto(result: Bored): BoredResponseDto {
        return {
            activity: result.activity,
            type: result.type,
            participants: result.participants,
            accessibility: result.accessibility,
            duration: result.duration,
            kidFriendly: result.kidFriendly,
            link: result.link,
            key: result.key
        };
    }
}