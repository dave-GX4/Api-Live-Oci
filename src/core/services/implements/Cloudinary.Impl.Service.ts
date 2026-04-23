import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import ExternalApiError from '../../errors/ExternalApiError';
import ICloudinaryService from '../interface/I.Cloudinary.Service';

export default class CloudinaryImplService implements ICloudinaryService{
    private readonly maxSizeBytes: number;
    private readonly targetSize: number;

    constructor(
        private readonly envCloudName: string,
        private readonly envApiKey: string,
        private readonly envApiSecret: string,
        private readonly envMaxSize: number,
        private readonly envTargetSize: number
    ){
        this.maxSizeBytes = (this.envMaxSize ?? 5) * 1024 * 1024;
        this.targetSize = this.envTargetSize ?? 800;

        cloudinary.config({
            cloud_name: this.envCloudName,
            api_key: this.envApiKey,
            api_secret: this.envApiSecret,
            secure: true
        });
    }

    private validateFileSize(buffer: Buffer): void {
        if (buffer.length > this.maxSizeBytes) {
            throw new ExternalApiError(
                'Cloudinary',
                `Image too large. Max ${this.maxSizeBytes / 1024 / 1024}MB allowed`
            );
        }
    }

    private async processImage(buffer: Buffer): Promise<Buffer> {
        try {
            const image = sharp(buffer);
            const metadata = await image.metadata();

            if (!metadata.width || !metadata.height) {
                throw new ExternalApiError('Cloudinary', 'Invalid image file or corrupted');
            }

            // FIX: Forzar a 800x800, recortando desde el centro si es necesario
            return await image
                .resize(this.targetSize, this.targetSize, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ 
                    quality: 85, 
                    progressive: true,
                    force: true
                })
                .toBuffer();

        } catch (error) {
            if (error instanceof ExternalApiError) throw error;
            throw new ExternalApiError(
                'Cloudinary',
                `Image processing failed: ${error instanceof Error ? error.message : 'unknown error'}`
            );
        }
    }

    async upload(
        file: Buffer,
        publicId: string
    ): Promise<{ publicId: string; url: string }> {
        try {
            // Validación de peso
            this.validateFileSize(file);

            // Validación de dimensiones + redimensionamiento fijo
            const processedBuffer = await this.processImage(file);

            // Upload con reemplazo (overwrite: true)
            return await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        public_id: publicId,
                        overwrite: true,
                        invalidate: true,
                        resource_type: 'image',
                        format: 'jpg'
                    },
                    (error, result) => {
                        if (error) {
                            return reject(
                                new ExternalApiError('Cloudinary', error.message)
                            );
                        }
                        if (!result) {
                            return reject(
                                new ExternalApiError('Cloudinary', 'Empty response from upload')
                            );
                        }
                        resolve({
                            publicId: result.public_id,
                            url: result.secure_url
                        });
                    }
                );
                stream.end(processedBuffer);
            });

        } catch (error) {
            if (error instanceof ExternalApiError) throw error;
            throw new ExternalApiError(
                'Cloudinary',
                `Upload failed: ${error instanceof Error ? error.message : 'unknown error'}`
            );
        }
    }

    async delete(publicId: string): Promise<void> {
        try {
            // Eliminación completa del asset
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: 'image'
            });

            // Cloudinary retorna 'ok', 'not found' u otros estados
            if (result.result !== 'ok' && result.result !== 'not found') {
                throw new ExternalApiError(
                    'Cloudinary',
                    `Delete failed with status: ${result.result}`
                );
            }

        } catch (error) {
            if (error instanceof ExternalApiError) throw error;
            throw new ExternalApiError(
                'Cloudinary',
                `Delete failed: ${error instanceof Error ? error.message : 'unknown error'}`
            );
        }
    }


    async getUrl(publicId: string): Promise<string> {
        try {
            return cloudinary.url(publicId, {
                width: this.targetSize,
                height: this.targetSize,
                crop: 'fill',
                quality: 'auto',
                fetch_format: 'auto',
                secure: true,
                version: Date.now()
            });
        } catch (error) {
            throw new ExternalApiError(
                'Cloudinary',
                `URL generation failed: ${error instanceof Error ? error.message : 'unknown error'}`
            );
        }
    }
}