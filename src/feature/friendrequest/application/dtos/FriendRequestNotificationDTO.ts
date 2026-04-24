export default interface FriendRequestNotificationDTO {
    id: string;
    requesterId: string;
    requesterName: string;
    requesterAvatarUrl?: string;
    status: string;
    createdAt: Date;
    message?: string;
}