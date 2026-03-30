"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetRandomUseCase {
    constructor(externalBored) {
        this.externalBored = externalBored;
    }
    async run() {
        const result = await this.externalBored.getRandomActivity();
        const bored = {
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
exports.default = GetRandomUseCase;
