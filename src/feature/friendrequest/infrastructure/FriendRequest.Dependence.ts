import pool from "../../../core/config/data.base.conection";
import UuidService from "../../../core/services/implements/Uuid.Service";
import CancelFriendRequestUseCase from "../application/usecases/CancelFriendRequest.UseCase";
import FriendRequestUpdateUseCase from "../application/usecases/FriendRequestUpdate.UseCase";
import SendFriendRequestUseCase from "../application/usecases/SendFriendRequest.UseCase";
import CancelFriendRequestController from "./controllers/CancelFriendRequest.Controller";
import FriendRequestUpdateController from "./controllers/FriendRequestUpdate.Controller";
import SendFriendRequestController from "./controllers/SendFriendRequest.Controller";
import FriendRequestMySqlPersistence from "./db/FriendReuqest.MySql.persistence";

const mySqlPersistenceFriendRequest = new FriendRequestMySqlPersistence(pool);

const uuidService = new UuidService();

const sendFriendRequestUseCase = new SendFriendRequestUseCase(
    mySqlPersistenceFriendRequest, 
    uuidService
);
const friendRequestUpdateUseCase = new FriendRequestUpdateUseCase(mySqlPersistenceFriendRequest);
const cancelFriendRequestUseCase = new CancelFriendRequestUseCase(mySqlPersistenceFriendRequest);

export const sendFriendRequestController = new SendFriendRequestController(sendFriendRequestUseCase);
export const friendRequestUpdateController = new FriendRequestUpdateController(friendRequestUpdateUseCase);
export const cancelFriendRequestController = new CancelFriendRequestController(cancelFriendRequestUseCase);