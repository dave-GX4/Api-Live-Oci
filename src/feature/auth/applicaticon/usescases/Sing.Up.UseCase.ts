import AuthRepository from "../../domain/auth_repository";
import Auth from "../../domain/entitie/auth";
import SingUpRequest from "../dtos/singUp_Request";
import EncryptService from "../../../../core/services/interface/encryptService";
import UuidService from "../../../../core/services/interface/uuidService";
import UUID from "../../../../core/valueobjects/UUID";
import Email from "../../../../core/valueobjects/Email";
import Password from "../../../../core/valueobjects/Password";
import AuthResponse from "../dtos/Auth.Response";

export default class SingUpUseCase {
    constructor(
        private readonly repository: AuthRepository,
        private readonly serviceUuid: UuidService,
        private readonly serviceEncrypt: EncryptService
    ) { }

    async run(authRequest: SingUpRequest): Promise<AuthResponse> {
        const uuid = await this.serviceUuid.generate()
        const uuidValue = UUID.validate(uuid)

        const emailValue = Email.validated(authRequest.email)

        const passwordValue = Password.validated(authRequest.password)
        const passwordHash = await this.serviceEncrypt.hash(passwordValue.getValue())
        const passwordConvert = Password.convert(passwordHash)

        const newUser: Auth = {
            uuid: uuidValue,
            name: authRequest.name,
            email: emailValue,
            password: passwordConvert
        }

        await this.repository.createUser(newUser)

        return {
            message: "Se a creado tu cuenta correctamente: " + newUser.name,
            status: true
        }
    }
}