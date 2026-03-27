"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const Email_1 = __importDefault(require("../../../../core/valueobjects/Email"));
const Password_1 = __importDefault(require("../../../../core/valueobjects/Password"));
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class UpdateUserUseCase {
    constructor(repository, encryptService) {
        this.repository = repository;
        this.encryptService = encryptService;
    }
    async run(id, leisureType, email, password, notifications, interests, topics, description) {
        const idValue = UUID_1.default.validate(id);
        const user = await this.repository.getByIdUser(idValue.getValue());
        if (!user) {
            throw new NotFoundError_1.NotFoundError("Usuario", id, "UUID");
        }
        if (idValue.getValue() !== user.uuid.getValue()) {
            throw new InvalidError_1.default("No tienes permisos para modificar estos datos");
        }
        const updates = {};
        if (leisureType !== undefined && leisureType !== user.leisureType) {
            updates.leisureType = leisureType;
        }
        if (email !== undefined && email !== user.email.getValue()) {
            updates.email = Email_1.default.validated(email).getValue();
        }
        if (password !== undefined) {
            const pwd = Password_1.default.validated(password);
            const hashed = await this.encryptService.hash(pwd.getValue());
            updates.password = hashed;
        }
        if (notifications !== undefined && notifications !== user.notifications) {
            updates.notifications = notifications;
        }
        if (interests !== undefined) {
            updates.interests = interests;
        }
        if (topics !== undefined) {
            updates.topics = topics;
        }
        if (description !== undefined && description !== user.description) {
            updates.description = description;
        }
        if (Object.keys(updates).length > 0) {
            await this.repository.updateUser(idValue.getValue(), updates);
        }
        return {
            message: "Se actualizaron correctamente tu(s) datos",
            status: 200
        };
    }
}
exports.default = UpdateUserUseCase;
