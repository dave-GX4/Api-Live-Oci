import ICloudinaryService from "../../../../core/services/interface/I.Cloudinary.Service";
import CloudinaryRepository from "../../domain/Cloudinary.Repository";
import { GetPhotoOutput } from "../dtos/GetPhotoOutput";

export default class GetPhotoUseCase {
    constructor(
        private readonly repository: CloudinaryRepository,
        private readonly cloudinaryService: ICloudinaryService
    ) {}

    async execute(userId: string): Promise<GetPhotoOutput | null> {
        const photo = await this.repository.findByUserId(userId);

        if (!photo) {
            return null;
        }

        const url = await this.cloudinaryService.getUrl(photo.publicId);

        return {
            publicId: photo.publicId,
            url
        };
    }
}