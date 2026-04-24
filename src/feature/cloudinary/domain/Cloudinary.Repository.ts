import FilePhoto from "./entity/FilePhoto"

export default interface CloudinaryRepository {
    save(photo: FilePhoto): Promise<void>;
    findByUserId(userId: string): Promise<FilePhoto | null>;
    deleteByUserId(userId: string): Promise<void>;
}