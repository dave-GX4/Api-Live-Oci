"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
const Email_1 = __importDefault(require("../../../../core/valueobjects/Email"));
const Password_1 = __importDefault(require("../../../../core/valueobjects/Password"));
class SingUpUseCase {
    constructor(repository, serviceUuid, serviceEncrypt) {
        this.repository = repository;
        this.serviceUuid = serviceUuid;
        this.serviceEncrypt = serviceEncrypt;
    }
    async run(authRequest) {
        const uuid = await this.serviceUuid.generate();
        const uuidValue = UUID_1.default.validate(uuid);
        const emailValue = Email_1.default.validated(authRequest.email);
        const passwordValue = Password_1.default.validated(authRequest.password);
        const passwordHash = await this.serviceEncrypt.hash(passwordValue.getValue());
        const passwordConvert = Password_1.default.convert(passwordHash);
        const newUser = {
            uuid: uuidValue,
            name: authRequest.name,
            email: emailValue,
            password: passwordConvert
        };
        console.log(newUser);
        await this.repository.createUser(newUser);
        return {
            message: "Se a creado tu cuenta correctamente: " + newUser.name,
            status: true
        };
    }
}
exports.default = SingUpUseCase;
