import pool from "../../../core/config/data.base.conection";
import { env } from "../../../core/config/env.config";
import CloudinaryImplService from "../../../core/services/implements/Cloudinary.Impl.Service";
import UuidService from "../../../core/services/implements/Uuid.Service";
import CloudinaryMySQLPersistence from "../../cloudinary/infrastructure/db/Cloudinary.MySql.Persistence";
import NotificationMySqlPersistence from "../../notifications/infrastructure/db/Notification.My.SQL.Persistence";
import GlobalSseManager from "../../sse/service/GlobalSseManager";
import MySqlUserPersistence from "../../user/infrastructure/db/MySql.User.Persistence";
import CancelFriendRequestUseCase from "../application/usecases/CancelFriendRequest.UseCase";
import FriendRequestUpdateUseCase from "../application/usecases/FriendRequestUpdate.UseCase";
import GetFriendsListUseCase from "../application/usecases/GetFriendsList.UseCase";
import GetPendingFriendRequestsUseCase from "../application/usecases/GetPendingFriendRequests.UseCase";
import RemoveFriendUseCase from "../application/usecases/RemoveFriend.UseCase";
import SendFriendRequestUseCase from "../application/usecases/SendFriendRequest.UseCase";
import CancelFriendRequestController from "./controllers/CancelFriendRequest.Controller";
import FriendRequestUpdateController from "./controllers/FriendRequestUpdate.Controller";
import GetFriendsListController from "./controllers/GetFriendsList.Controller";
import GetPendingFriendRequestsController from "./controllers/GetPendingFriendRequests.Controller";
import RemoveFriendController from "./controllers/RemoveFriend.Controller";
import SendFriendRequestController from "./controllers/SendFriendRequest.Controller";
import FriendMySqlPersistence from "./db/Friend.MySql.persistence";

const mySqlPersistenceFriend = new FriendMySqlPersistence(pool);
const mySqlPersistenceUser = new MySqlUserPersistence(pool);
const mySqlPersistenceCloudinary = new CloudinaryMySQLPersistence(pool);
const mySqlPersistenceNotification = new NotificationMySqlPersistence(pool);

const cloudinaryService = new CloudinaryImplService(
    env.cloudinary.name,
    env.cloudinary.apiKey,
    env.cloudinary.apiSecret,
    env.cloudinary.maxSizeMB,
    env.cloudinary.targetSize
);
const friendNotifierSse = new GlobalSseManager();
const uuidService = new UuidService();

const sendFriendRequestUseCase = new SendFriendRequestUseCase(
    mySqlPersistenceFriend,
    mySqlPersistenceNotification,
    uuidService,
    mySqlPersistenceUser,
    mySqlPersistenceCloudinary,
    cloudinaryService,
    friendNotifierSse
);
const friendRequestUpdateUseCase = new FriendRequestUpdateUseCase(
    mySqlPersistenceFriend,
    mySqlPersistenceNotification,
    mySqlPersistenceUser,
    mySqlPersistenceCloudinary,
    cloudinaryService,
    uuidService,
    friendNotifierSse
);
const cancelFriendRequestUseCase = new CancelFriendRequestUseCase(mySqlPersistenceFriend);
const getPendingFriendRequestsUseCase = new GetPendingFriendRequestsUseCase(
    mySqlPersistenceFriend,
    mySqlPersistenceUser,
    mySqlPersistenceCloudinary,
    cloudinaryService
);
const removeFriendUseCase = new RemoveFriendUseCase(
    mySqlPersistenceFriend,
    friendNotifierSse
);
const getFriendsListUseCase = new GetFriendsListUseCase(
    mySqlPersistenceFriend,
    mySqlPersistenceUser,
    mySqlPersistenceCloudinary,
    cloudinaryService
);

export const sendFriendRequestController = new SendFriendRequestController(sendFriendRequestUseCase);
export const friendRequestUpdateController = new FriendRequestUpdateController(friendRequestUpdateUseCase);
export const cancelFriendRequestController = new CancelFriendRequestController(cancelFriendRequestUseCase);
export const getPendingFriendRequestsController = new GetPendingFriendRequestsController(getPendingFriendRequestsUseCase);
export const getFriendsListController = new GetFriendsListController(getFriendsListUseCase);
export const removeFriendController = new RemoveFriendController(removeFriendUseCase);