import UserPublicProfile from "../application/dto/UserPublicProfile";
import User from "./entity/User"

export default interface UserRepository {
    updateUser(id: string, updates: Partial<{
        name: string;
        email: string;
        password: string;
        notificactions: boolean;
        interests?: string[],
        topics?: string[],
        description: string;
        leisureType: string;
    }>): Promise<void>
    getByIdUser(id: string): Promise<User | null>
    deleteAccount(id: string): Promise<void>
    getPublicProfile(userId: string): Promise<UserPublicProfile | null>;
}