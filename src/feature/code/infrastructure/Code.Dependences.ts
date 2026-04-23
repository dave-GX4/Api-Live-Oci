import pool from "../../../core/config/data.base.conection";
import { env } from "../../../core/config/env.config";
import CloudinaryImplService from "../../../core/services/implements/Cloudinary.Impl.Service";
import CryptoCodeGenerator from "../../../core/services/implements/CryptoCode.Service";
import CloudinaryMySQLPersistence from "../../cloudinary/infrastructure/db/Cloudinary.MySql.Persistence";
import MySqlUserPersistence from "../../user/infrastructure/db/MySql.User.Persistence";
import GetFriendCodeUseCase from "../application/usecases/GetFriendCode.UseCase";
import RegenerateFriendCodeUseCase from "../application/usecases/RegenerateFriendCode.UseCase";
import SearchUserByCodeUseCase from "../application/usecases/SearchUserByCode.UseCase";
import GetCodeController from "./controllers/GetCode.Controller";
import SearchUserByCodeController from "./controllers/SearchUserByCode.Controller";
import { CodeExpirationCron } from "./cron/CodeExpiration.Cron";
import CodeMySqlPersistence from "./db/Code.MySql.Persistence";
import SseConnectionManager from "./services/impl/SseConnectionManager";

const codeMySqlPersistence = new CodeMySqlPersistence(pool);
const userMySqlPersistence = new MySqlUserPersistence(pool);
const cloudinaryMySQLPersistence = new CloudinaryMySQLPersistence(pool);

const cryptoCodeService = new CryptoCodeGenerator();
const sseConnectionManager = new SseConnectionManager();
const cloudinaryService = new CloudinaryImplService(
    env.cloudinary.name,
    env.cloudinary.apiKey,
    env.cloudinary.apiSecret,
    env.cloudinary.maxSizeMB,
    env.cloudinary.targetSize
);

const getUseCase = new GetFriendCodeUseCase(codeMySqlPersistence);
const regenerateUseCase = new RegenerateFriendCodeUseCase(
    codeMySqlPersistence,
    cryptoCodeService,
    sseConnectionManager
);
const searchUseCase = new SearchUserByCodeUseCase(
    codeMySqlPersistence,
    userMySqlPersistence,
    cloudinaryMySQLPersistence,
    cloudinaryService
);

export const getController = new GetCodeController(
    getUseCase,
    sseConnectionManager
)
export const codeExpirationCron = new CodeExpirationCron(
    regenerateUseCase,
    codeMySqlPersistence
);
export const searchController = new SearchUserByCodeController(searchUseCase);