import pool from "../../../core/config/data.base.conection";
import { env } from "../../../core/config/env.config";
import CloudinaryImplService from "../../../core/services/implements/Cloudinary.Impl.Service";
import DeletePhotoUseCase from "../application/usecases/DeletePhoto.UseCase";
import GetPhotoUseCase from "../application/usecases/GetPhoto.UseCase";
import SavePhotoUseCase from "../application/usecases/SavePhoto.UseCase";
import DeletePhotoController from "./controllers/DeletePhoto.Controller";
import GetPhotoController from "./controllers/GetPhoto.Controller";
import SavePhotoController from "./controllers/SavePhoto.Controller";
import CloudinaryMySQLPersistence from "./db/Cloudinary.MySql.Persistence";

const mySqlPersistence = new CloudinaryMySQLPersistence(pool);
const cloudinaryService = new CloudinaryImplService(
    env.cloudinary.name,
    env.cloudinary.apiKey,
    env.cloudinary.apiSecret,
    env.cloudinary.maxSizeMB,
    env.cloudinary.targetSize
);

const saveUseCase = new SavePhotoUseCase(cloudinaryService, mySqlPersistence);
const deleteUseCase = new DeletePhotoUseCase(cloudinaryService,mySqlPersistence);
const getUseCase = new GetPhotoUseCase(mySqlPersistence, cloudinaryService);

export const saveController = new SavePhotoController(saveUseCase);
export const deleteController = new DeletePhotoController(deleteUseCase);
export const getController = new GetPhotoController(getUseCase);