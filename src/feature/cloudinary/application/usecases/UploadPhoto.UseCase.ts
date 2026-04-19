import UUID from "../../../../core/valueobjects/UUID";
import { CloudinaryRepository } from "../../domain/Cloudinary.Repository";
import FilePhoto from "../../domain/entity/FilePhoto";
import { UploadPhotoInput } from "../dtos/UploadPhotoInput";
import { UploadPhotoOutput } from "../dtos/MessagePhotoResponseDTO";
import { CloudinaryService } from "../services/Cloudinary.Service";

export default class UploadPhotoUseCase {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly repository: CloudinaryRepository
    ) {}

    async execute(input: UploadPhotoInput): Promise<UploadPhotoOutput> {
        const valueId = UUID.validate(input.userId);

        const publicId = `users/${valueId.getValue()}/avatar`;

        const existing = await this.repository.findByUserId(valueId.getValue());
        if (existing) {
            try {
                await this.cloudinaryService.delete(existing.publicId);
            } catch (error) {

                console.warn(`No se pudo eliminar imagen previa: ${existing.publicId}`);
            }
        }

        const result = await this.cloudinaryService.upload(input.file, publicId);

        const newFile: FilePhoto = {
            userId: valueId,
            publicId: result.publicId
        };

        await this.repository.save(newFile);

        return {
            message: "Se Subio Tu Foto Correctamente",
            status: true
        };
    }
}