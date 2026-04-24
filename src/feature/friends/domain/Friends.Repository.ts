import Friend from "./entity/Friend";

export default interface FriendsRepository{
    newFriendByuser(): Promise<void>
    getAllFriendsByUser(id: string): Promise<Friend | null>
    deleteFriend(id: string): Promise<void>
}