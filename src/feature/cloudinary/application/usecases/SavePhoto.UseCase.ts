import ICloudinaryService from "../../../../core/services/interface/I.Cloudinary.Service";
import UUID from "../../../../core/valueobjects/UUID";
import CloudinaryRepository from "../../domain/Cloudinary.Repository";
import FilePhoto from "../../domain/entity/FilePhoto";
import { UploadPhotoInput } from "../dtos/UploadPhotoInput";

export default class SavePhotoUseCase {
    constructor(
        private readonly cloudinaryService: ICloudinaryService,
        private readonly repository: CloudinaryRepository
    ) {}

    async execute(input: UploadPhotoInput) {
        // Validar el ID
        const valueId = UUID.validate(input.userId);
        const userIdStr = valueId.getValue();
        const publicId = `users/${userIdStr}/avatar`;

        // Buscar si ya existe una foto
        const existing = await this.repository.findByUserId(userIdStr);
        const isNew = !existing; // Si no existe, es nueva

        // Si ya existe, eliminamos la anterior de Cloudinary
        if (existing) {
            try {
                await this.cloudinaryService.delete(existing.publicId);
            } catch (error) {
                console.warn(`No se pudo eliminar imagen previa: ${existing.publicId}`);
            }
        }

        // Subimos la nueva imagen a Cloudinary
        const result = await this.cloudinaryService.upload(input.file, publicId);

        // Guardamos en la base de datos (Tu método save ya hace el INSERT o UPDATE automáticamente)
        const newFile: FilePhoto = {
            userId: valueId,
            publicId: result.publicId
        };
        await this.repository.save(newFile);

        // Devolvemos el resultado y si fue creación o actualización
        return {
            message: isNew ? "Se subió tu foto correctamente" : "Se actualizó tu foto correctamente",
            status: true,
            isNew 
        };
    }
}