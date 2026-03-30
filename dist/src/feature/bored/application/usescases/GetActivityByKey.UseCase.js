"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetActivityByKeyUseCase {
    constructor(externalBored) {
        this.externalBored = externalBored;
    }
    async run(key) {
        const result = await this.externalBored.getActivityByKey(key);
        return this.mapToDto(result);
    }
    mapToDto(result) {
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
exports.default = GetActivityByKeyUseCase;
