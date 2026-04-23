import FriendRequest from "./entity/FriendRequest"

export default interface FriendRequestRepository {
    save(request: FriendRequest): Promise<void>;
    findBetweenUsers(userA: string, userB: string): Promise<FriendRequest | null>;
}