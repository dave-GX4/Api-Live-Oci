import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import ICloudinaryService from "../../../../core/services/interface/I.Cloudinary.Service";
import CloudinaryRepository from "../../../cloudinary/domain/Cloudinary.Repository";
import FriendRequestRepository from "../../../friendrequest/domain/FiendRequest.Repository";
import UserRepository from "../../../user/domain/User.Repository";
import CodeRepository from "../../domain/Code.Repository";
import FoundUserResult from "../dtos/FoundUserResult";

export default class SearchUserByCodeUseCase {
    constructor(
        private readonly codeRepository: CodeRepository,
        private readonly userRepository: UserRepository,
        private readonly cloudinaryRepository: CloudinaryRepository,
        private readonly cloudinaryService: ICloudinaryService,
        private readonly friendRequestRepository: FriendRequestRepository
    ){}

    async run(searcherId: string, code: string): Promise<FoundUserResult> {
        const friendCode = await this.codeRepository.findByCode(code);
        if (!friendCode) {
            throw new NotFoundError('Código de amigo', code, 'código');
        }

        if (friendCode.userId === searcherId) {
            throw new InvalidError('No puedes buscarte a ti mismo');
        }

        const userProfile = await this.userRepository.getPublicProfile(friendCode.userId);
        if (!userProfile) {
            throw new NotFoundError('Usuario', friendCode.userId);
        }

        let avatarUrl: string | undefined;
        const photo = await this.cloudinaryRepository.findByUserId(friendCode.userId);
        if (photo) {
            avatarUrl = await this.cloudinaryService.getUrl(photo.publicId);
        }

        const existingRequest = await this.friendRequestRepository.findBetweenUsers(
            searcherId, 
            friendCode.userId
        );

        let requestId: string | undefined;
        let requestStatus: FoundUserResult['requestStatus'];
        let isRequester: boolean | undefined;

        if (existingRequest) {
            requestId = existingRequest.id;
            requestStatus = existingRequest.status;
            isRequester = existingRequest.requesterId.getValue() === searcherId;
        }

        return {
            id: userProfile.id,
            name: userProfile.name,
            avatarUrl,
            code: friendCode.code,
            requestId,
            requestStatus,
            isRequester
        };
    }
}