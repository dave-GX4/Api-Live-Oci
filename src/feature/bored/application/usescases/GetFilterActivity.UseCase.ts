import BoredResponseDto from "../dto/BoredResponseDto";
import { IBoredService } from "../externalprovider/IBored.Service";

export default class GetFilterActivityUseCase {
    constructor(private readonly externalBored: IBoredService) {}

    async run(type: string, participants: number): Promise<BoredResponseDto[]> {
        const results = await this.externalBored.getFilterActivities(type, participants);
        return results.map(item => ({
            activity: item.activity,
            type: item.type,
            participants: item.participants,
            accessibility: item.accessibility,
            duration: item.duration,
            kidFriendly: item.kidFriendly,
            link: item.link,
            key: item.key
        }));
    }
}