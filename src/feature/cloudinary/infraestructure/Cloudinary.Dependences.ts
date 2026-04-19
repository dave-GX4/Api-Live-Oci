import pool from "../../../core/config/data.base.conection";
import { env } from "../../../core/config/env.config";
import DeletePhotoUseCase from "../application/usecases/DeletePhoto.UseCase";
import GetPhotoUseCase from "../application/usecases/GetPhoto.UseCase";
import UpdatePhotoUseCase from "../application/usecases/UpdatePhoto.UseCase";
import UploadPhotoUseCase from "../application/usecases/UploadPhoto.UseCase";
import DeletePhotoController from "./controllers/DeletePhoto.Controller";
import GetPhotoController from "./controllers/GetPhoto.Controller";
import UpdatePhotoController from "./controllers/UpdatePhoto.Controller";
import UploadPhotoController from "./controllers/UploadPhoto.Controller";
import CloudinaryMySQLPersistence from "./db/Cloudinary.MySql.Persistence";
import CloudinaryImplService from "./services/Cloudinary.Impl.Service";

const mySqlPersistence = new CloudinaryMySQLPersistence(pool);
const cloudinaryService = new CloudinaryImplService(
    env.cloudinary.name,
    env.cloudinary.apiKey,
    env.cloudinary.apiSecret,
    env.cloudinary.maxSizeMB,
    env.cloudinary.targetSize
);

const uploadUseCase = new UploadPhotoUseCase(cloudinaryService, mySqlPersistence);
const updateUseCase = new UpdatePhotoUseCase(cloudinaryService, mySqlPersistence);
const deleteUseCase = new DeletePhotoUseCase(cloudinaryService,mySqlPersistence);
const getUseCase = new GetPhotoUseCase(mySqlPersistence, cloudinaryService);

export const uploadController = new UploadPhotoController(uploadUseCase);
export const updateController = new UpdatePhotoController(updateUseCase);
export const deleteController = new DeletePhotoController(deleteUseCase);
export const getController = new GetPhotoController(getUseCase);