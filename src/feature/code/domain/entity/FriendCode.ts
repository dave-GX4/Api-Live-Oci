import UUID from "../../../../core/valueobjects/UUID";

export default interface FriendCode {
    id: UUID;
    userId: string;
    code: string;
    expiresAt: Date;
    regeneratedAt?: Date;
}