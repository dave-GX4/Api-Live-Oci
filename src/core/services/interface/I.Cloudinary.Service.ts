export default interface ICloudinaryService {
    upload(
        file: Buffer, 
        publicIdPrefix: string
    ): Promise<{ publicId: string; url: string }>;
    delete(publicId: string): Promise<void>;
    getUrl(publicId: string): Promise<string>;
}