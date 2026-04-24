import { NotFoundError } from "../../../../core/errors/NotFoundError";
import ICloudinaryService from "../../../../core/services/interface/I.Cloudinary.Service";
import CloudinaryRepository from "../../domain/Cloudinary.Repository";


export default class DeletePhotoUseCase {
    constructor(
        private readonly cloudinaryService: ICloudinaryService,
        private readonly repository: CloudinaryRepository
    ) {}

    async execute(userId: string): Promise<void> {
        const photo = await this.repository.findByUserId(userId);

        if (!photo) {
            throw new NotFoundError("Foto de perfil", userId, "UUID");
        }

        await this.cloudinaryService.delete(photo.publicId);

        await this.repository.deleteByUserId(userId);
    }
}