import { hash, compare } from "bcrypt";
import EncryptService from "../interface/encryptService";

export default class BcryptEncryptService implements EncryptService {

    private readonly SALT_ROUNDS = 10;

    async hash(password: string): Promise<string> {
        return await hash(password, this.SALT_ROUNDS);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }
}