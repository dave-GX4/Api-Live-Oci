import UUID from "../../../../core/valueobjects/UUID";
import { FriendStatus } from "./enums/Friends.Status";

export default interface Friend{
    id: UUID;
    user_a_id: UUID;
    user_b_id: UUID;
    status: FriendStatus;
    blocked_by: string;
    created_at: Date;
}