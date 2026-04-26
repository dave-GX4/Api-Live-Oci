export interface FriendProfileDTO {
    friendshipId: string;
    userId: string;
    name: string;
    avatarUrl?: string;
    friendsSince: Date;
}