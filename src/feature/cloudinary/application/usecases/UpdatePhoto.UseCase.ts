import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { CloudinaryRepository } from "../../domain/Cloudinary.Repository";
import { UploadPhotoInput } from "../dtos/UploadPhotoInput";
import { UploadPhotoOutput } from "../dtos/MessagePhotoResponseDTO";
import { CloudinaryService } from "../services/Cloudinary.Service";

export default class UpdatePhotoUseCase {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly repository: CloudinaryRepository
    ) {}

    async execute(input: UploadPhotoInput): Promise<UploadPhotoOutput> {

        const existing = await this.repository.findByUserId(input.userId);
        if (!existing) {
            throw new NotFoundError("Foto de perfil", input.userId, "UUID");
        }

        await this.cloudinaryService.delete(existing.publicId);

        const publicId = `users/${input.userId}/avatar`;
        const result = await this.cloudinaryService.upload(input.file, publicId);

        await this.repository.updatePublicId(input.userId, result.publicId);

        return {
            message: "Se Actualizo Tu Foto Correctamente",
            status: true
        };
    }
}