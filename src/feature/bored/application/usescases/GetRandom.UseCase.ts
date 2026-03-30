import BoredResponseDto from "../dto/BoredResponseDto";
import { IBoredService } from "../externalprovider/IBored.Service";

export default class GetRandomUseCase{
    constructor(
        private readonly externalBored: IBoredService
    ){}

    async run(): Promise<BoredResponseDto>{
        const result = await this.externalBored.getRandomActivity()

        const bored: BoredResponseDto = {
            activity: result.activity,
            type: result.type,
            participants: result.participants,
            accessibility: result.accessibility,
            duration: result.duration,
            kidFriendly: result.kidFriendly,
            link: result.link,
            key: result.key
        };

        return bored;
    }
}