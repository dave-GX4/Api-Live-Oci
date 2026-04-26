import InvalidError from "../../../../core/errors/InvalidError";
import ICloudinaryService from "../../../../core/services/interface/I.Cloudinary.Service";
import CloudinaryRepository from "../../../cloudinary/domain/Cloudinary.Repository";
import UserRepository from "../../../user/domain/User.Repository";
import FriendRepository from "../../domain/Fiend.Repository";
import { FriendProfileDTO } from "../dtos/FriendProfileDTO";

export default class GetFriendsListUseCase {
    constructor(
        private readonly friendRepository: FriendRepository,
        private readonly userRepository: UserRepository,
        private readonly cloudinaryRepository: CloudinaryRepository,
        private readonly cloudinaryService: ICloudinaryService
    ) {}

    async run(userId: string): Promise<FriendProfileDTO[]> {
        if (!userId) throw new InvalidError('El ID de usuario es requerido');

        const friendships = await this.friendRepository.findAllFriendsByUserId(userId);

        if (friendships.length === 0) return [];

        const friendsProfiles = await Promise.all(
            friendships.map(async (friendship) => {
                
                const myId = userId;
                const friendUserId = friendship.requesterId.getValue() === myId 
                    ? friendship.addresseeId.getValue() 
                    : friendship.requesterId.getValue();

                const profile = await this.userRepository.getPublicProfile(friendUserId);
                
                let avatarUrl: string | undefined;
                const photo = await this.cloudinaryRepository.findByUserId(friendUserId);
                if (photo) {
                    avatarUrl = await this.cloudinaryService.getUrl(photo.publicId);
                }

                return {
                    friendshipId: friendship.id,
                    userId: friendUserId,
                    name: profile?.name || 'Usuario Desconocido',
                    avatarUrl: avatarUrl,
                    friendsSince: friendship.updatedAt || new Date()
                } as FriendProfileDTO;
            })
        );

        return friendsProfiles;
    }
}