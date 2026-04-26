import { RequestStatus } from "./entity/enums/Request.Status";
import FriendRequest from "./entity/FriendRequest"

export default interface FriendRepository {
    save(request: FriendRequest): Promise<void>;
    findBetweenUsers(userA: string, userB: string): Promise<FriendRequest | null>;
    findById(id: string): Promise<FriendRequest | null>;
    findPendingByUserId(userId: string): Promise<FriendRequest[]>;
    update(id: string, status: RequestStatus): Promise<void>;
    delete(id: string): Promise<void>;
}