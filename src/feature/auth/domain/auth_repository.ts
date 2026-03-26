import Auth from "./entitie/auth";

export default interface AuthRepository {
    createUser(auth: Auth): Promise<void>;
    findUserByEmail(email: string): Promise<Auth | null>;
}