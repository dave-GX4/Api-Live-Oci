import { CloudinaryRepository } from "../../domain/Cloudinary.Repository";
import { GetPhotoOutput } from "../dtos/GetPhotoOutput";
import { CloudinaryService } from "../services/Cloudinary.Service";

export default class GetPhotoUseCase {
    constructor(
        private readonly repository: CloudinaryRepository,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async execute(userId: string): Promise<GetPhotoOutput | null> {
        const photo = await this.repository.findByUserId(userId);

        if (!photo) {
            return null;
        }

        const url = await this.cloudinaryService.getUrl(photo.publicId);

        return {
            userId: photo.userId.getValue(),
            publicId: photo.publicId,
            url
        };
    }
}