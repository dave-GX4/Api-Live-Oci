import FriendCode from "./entity/FriendCode"

export default interface CodeRepository {
    saveCodeUser(userId: string, code: FriendCode): Promise<void>;
    getCodeByUser(userId: string): Promise<FriendCode | null>;
    updateCodeUser(userId: string, newCode: FriendCode): Promise<void>;
}
