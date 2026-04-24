import pool from "../../../core/config/data.base.conection";
import { env } from "../../../core/config/env.config";
import CloudinaryImplService from "../../../core/services/implements/Cloudinary.Impl.Service";
import UuidService from "../../../core/services/implements/Uuid.Service";
import CloudinaryMySQLPersistence from "../../cloudinary/infrastructure/db/Cloudinary.MySql.Persistence";
import MySqlUserPersistence from "../../user/infrastructure/db/MySql.User.Persistence";
import CancelFriendRequestUseCase from "../application/usecases/CancelFriendRequest.UseCase";
import FriendRequestUpdateUseCase from "../application/usecases/FriendRequestUpdate.UseCase";
import GetPendingFriendRequestsUseCase from "../application/usecases/GetPendingFriendRequests.UseCase";
import SendFriendRequestUseCase from "../application/usecases/SendFriendRequest.UseCase";
import CancelFriendRequestController from "./controllers/CancelFriendRequest.Controller";
import FriendRequestUpdateController from "./controllers/FriendRequestUpdate.Controller";
import GetPendingFriendRequestsController from "./controllers/GetPendingFriendRequests.Controller";
import SendFriendRequestController from "./controllers/SendFriendRequest.Controller";
import StreamFriendRequestController from "./controllers/StreamFriendRequest.Controller";
import FriendRequestMySqlPersistence from "./db/FriendReuqest.MySql.persistence";
import SseFriendRequestManager from "./services/implements/SseFriendRequestManager";

const mySqlPersistenceFriendRequest = new FriendRequestMySqlPersistence(pool);
const mySqlPersistenceUser = new MySqlUserPersistence(pool);
const mySqlPersistenceCloudinary = new CloudinaryMySQLPersistence(pool)
const cloudinaryService = new CloudinaryImplService(
    env.cloudinary.name,
    env.cloudinary.apiKey,
    env.cloudinary.apiSecret,
    env.cloudinary.maxSizeMB,
    env.cloudinary.targetSize
);

const friendNotifierSse = new SseFriendRequestManager();

const uuidService = new UuidService();

const sendFriendRequestUseCase = new SendFriendRequestUseCase(
    mySqlPersistenceFriendRequest, 
    uuidService,
    mySqlPersistenceUser,
    friendNotifierSse
);
const friendRequestUpdateUseCase = new FriendRequestUpdateUseCase(mySqlPersistenceFriendRequest);
const cancelFriendRequestUseCase = new CancelFriendRequestUseCase(mySqlPersistenceFriendRequest);
const getPendingFriendRequestsUseCase = new GetPendingFriendRequestsUseCase(
    mySqlPersistenceFriendRequest,
    mySqlPersistenceUser,
    mySqlPersistenceCloudinary,
    cloudinaryService
);

export const sendFriendRequestController = new SendFriendRequestController(sendFriendRequestUseCase);
export const friendRequestUpdateController = new FriendRequestUpdateController(friendRequestUpdateUseCase);
export const cancelFriendRequestController = new CancelFriendRequestController(cancelFriendRequestUseCase);
export const getPendingFriendRequestsController = new GetPendingFriendRequestsController(getPendingFriendRequestsUseCase);
export const streamFriendRequestController = new StreamFriendRequestController(friendNotifierSse);