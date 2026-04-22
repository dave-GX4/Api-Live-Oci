import UUID from "../../../../core/valueobjects/UUID";

export default interface FriendCode {
    id: UUID;
    user_id: UUID;
    code: string;
    expires_at: Date;
    regenerated_at?: Date;
}