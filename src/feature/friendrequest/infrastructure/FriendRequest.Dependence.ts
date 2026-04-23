import pool from "../../../core/config/data.base.conection";
import UuidService from "../../../core/services/implements/Uuid.Service";
import SendFriendRequestUseCase from "../application/usecases/SendFriendRequest.UseCase";
import SendFriendRequestController from "./controllers/SendFriendRequest.Controller";
import FriendRequestMySqlPersistence from "./db/FriendReuqest.MySql.persistence";

const mySqlPersistenceFriendRequest = new FriendRequestMySqlPersistence(pool);

const uuidService = new UuidService();

const sendFriendRequestUseCase = new SendFriendRequestUseCase(
    mySqlPersistenceFriendRequest, 
    uuidService
);

export const sendFriendRequestController = new SendFriendRequestController(sendFriendRequestUseCase);