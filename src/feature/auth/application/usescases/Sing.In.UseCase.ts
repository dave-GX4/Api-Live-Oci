import AuthRepository from "../../domain/auth_repository";
import InvalidError from "../../../../core/errors/InvalidError";
import EncryptService from "../../../../core/services/interface/I.Encrypt.Service";
import AuthRespose from "../dtos/Auth.Response";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class SingInUseCase {
    constructor(
        private readonly repository: AuthRepository,
        private readonly serviceEncrypt: EncryptService
    ) { }

    async run(email: string, password: string): Promise<AuthRespose> {
        const user = await this.repository.findUserByEmail(email)

        if (!user) {
            throw new NotFoundError('Usuario', email, 'email');
        }

        const isPasswordValid = await this.serviceEncrypt.compare(password, user.password.getValue());

        if (!isPasswordValid) {
            throw new InvalidError('Contraseña invalida');
        }

        return {
            data: user.uuid.getValue(),
            message: "Se a verificado correctamente",
            status: true
        }
    }
}