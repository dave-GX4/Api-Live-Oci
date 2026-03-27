"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class GetByIdUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async run(id) {
        const idValue = UUID_1.default.validate(id);
        const user = await this.repository.getByIdUser(idValue.getValue());
        if (!user) {
            throw new NotFoundError_1.NotFoundError("La informacion no se encontro");
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
exports.default = GetByIdUserUseCase;
