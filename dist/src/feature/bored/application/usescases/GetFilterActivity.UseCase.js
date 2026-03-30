"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetFilterActivityUseCase {
    constructor(externalBored) {
        this.externalBored = externalBored;
    }
    async run(type, participants) {
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
exports.default = GetFilterActivityUseCase;
