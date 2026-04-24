import FriendRequestNotificationDTO from "../dtos/FriendRequestNotificationDTO";

export default interface FriendRequestNotifier {
    notifyNewRequest(userId: string, payload: FriendRequestNotificationDTO): void;
    notifyRequestAccepted(userId: string, payload: any): void;
}