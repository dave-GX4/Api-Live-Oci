import Notification from "../../../notifications/domain/entity/Notification";

export default interface FriendRequestNotifier {
    notifyNewRequest(userId: string, payload: Notification): void;
    notifyFriendAdded(userId: string, payload: any): void; 
}