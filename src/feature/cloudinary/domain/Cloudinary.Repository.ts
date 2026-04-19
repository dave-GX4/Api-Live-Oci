import FilePhoto from "./entity/FilePhoto"

export interface CloudinaryRepository {
    save(photo: FilePhoto): Promise<void>;
    findByUserId(userId: string): Promise<FilePhoto | null>;
    deleteByUserId(userId: string): Promise<void>;
    updatePublicId(userId: string, publicId: string): Promise<void>;
}