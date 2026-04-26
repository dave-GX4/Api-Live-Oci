import { RequestStatus } from "./entity/enums/Request.Status";
import Friend from "./entity/Friend"

export default interface FriendRepository {
    save(request: Friend): Promise<void>;
    findBetweenUsers(userA: string, userB: string): Promise<Friend | null>;
    findById(id: string): Promise<Friend | null>;
    findPendingByUserId(userId: string): Promise<Friend[]>;
    findAllFriendsByUserId(userId: string): Promise<Friend[]>;
    update(id: string, status: RequestStatus): Promise<void>;
    delete(id: string): Promise<void>;
}