import pool from "../../../core/config/data_base_conection";
import DeleteAccountUseCase from "../application/usescases/DeleteAccount.UsesCase";
import GetByIdUserUseCase from "../application/usescases/GetByIdUser.UseCase";
import UpdateUserUseCase from "../application/usescases/UpdateUser.UseCase";
import DeleteAccountController from "./controllers/DeleteAccount.Controller";
import GetByIdUserController from "./controllers/GetByIdUser.Controller";
import UpdateUserController from "./controllers/UpdateUser.Controller";
import MySqlUserPersistence from "./db/MySql.User.Persistence";

const mySqlUserPersistence = new MySqlUserPersistence(pool);

const getByidUsecase = new GetByIdUserUseCase(mySqlUserPersistence);
const updateUsecase = new UpdateUserUseCase(mySqlUserPersistence);
const deleteUseCase = new DeleteAccountUseCase(mySqlUserPersistence);

export const getByIdController = new GetByIdUserController(getByidUsecase);
export const updateController = new UpdateUserController(updateUsecase);
export const deleteController = new DeleteAccountController(deleteUseCase);
