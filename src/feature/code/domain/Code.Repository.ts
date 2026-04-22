import FriendCode from "./entity/FriendCode"

export default interface CodeRepository {
    saveCodeUser(userId: string, code: FriendCode): Promise<void>;
    getCodeByUser(userId: string): Promise<FriendCode | null>;
    updateCodeUser(
        userId: string, 
        updates: { code: string; expiresAt: Date; regeneratedAt: Date }
    ): Promise<void>;
    getExpiredUsersIds(currentDate: Date): Promise<string[]>; 
}
