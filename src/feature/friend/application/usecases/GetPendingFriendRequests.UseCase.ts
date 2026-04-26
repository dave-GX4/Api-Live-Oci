import ICloudinaryService from "../../../../core/services/interface/I.Cloudinary.Service";
import CloudinaryRepository from "../../../cloudinary/domain/Cloudinary.Repository";
import UserRepository from "../../../user/domain/User.Repository";
import FriendRepository from "../../domain/Fiend.Repository";

export default class GetPendingFriendRequestsUseCase {
    constructor(
        private readonly friendRequestRepository: FriendRepository,
        private readonly userRepository: UserRepository,
        private readonly cloudinaryRepository: CloudinaryRepository,
        private readonly cloudinaryService: ICloudinaryService
    ) {}

    async run(userId: string): Promise<any[]> {
        const pendingRequests = await this.friendRequestRepository.findPendingByUserId(userId);

        if (!pendingRequests || pendingRequests.length === 0) return [];

        const formattedRequests = [];

        for (const req of pendingRequests) {
            const senderProfile = await this.userRepository.getPublicProfile(req.requesterId.getValue());
            if (senderProfile) {
                let avatarUrl = undefined;
                const photo = await this.cloudinaryRepository.findByUserId(senderProfile.id);
                if (photo) {
                    avatarUrl = await this.cloudinaryService.getUrl(photo.publicId);
                }

                formattedRequests.push({
                    id: req.id,
                    requesterId: senderProfile.id,
                    requesterName: senderProfile.name,
                    requesterAvatarUrl: avatarUrl,
                    status: req.status,
                    createdAt: req.createdAt
                });
            }
        }

        return formattedRequests;
    }
}