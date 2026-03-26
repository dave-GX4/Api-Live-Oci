import pool from "../../../core/config/data_base_conection";
import UuidService from "../../../core/services/implements/uuidService";
import AddScheduleUsesCase from "../application/usescases/AddSchedule.UseCase";
import DeleteScheduleUseCase from "../application/usescases/DeleteSchedule.UseCase";
import GetAllScheduleByUserUseCase from "../application/usescases/GetAllScheduleByUser.UseCase";
import GetByIdScheduleUseCase from "../application/usescases/GetByIdSchedule.UseCase";
import UpdateScheduleUseCase from "../application/usescases/UpdateSchedule.UseCase";
import AddScheduleController from "./controllers/AddSchedule.Controller";
import DeleteScheduleController from "./controllers/DeleteSchedule.Controller";
import GetAllScheduleByUserController from "./controllers/GetAllScheduleByUser.Controller";
import GetByIdScheduleController from "./controllers/GetByIdSchedule.Controller";
import UpdateScheduleController from "./controllers/UpdateSchedule.Controller";
import MySqlSchedulePersistence from "./db/MySqlSchedule.Persistence";

const mySqlSchedulePersistence = new MySqlSchedulePersistence(pool)
const serviceUuid = new UuidService()

const addUseCase = new AddScheduleUsesCase(mySqlSchedulePersistence, serviceUuid);
const getAllUseCase = new GetAllScheduleByUserUseCase(mySqlSchedulePersistence);
const getByIdUseCase = new GetByIdScheduleUseCase(mySqlSchedulePersistence);
const deleteUseCase = new DeleteScheduleUseCase(mySqlSchedulePersistence);
const updateUseCase = new UpdateScheduleUseCase(mySqlSchedulePersistence);

export const addController = new AddScheduleController(addUseCase);
export const getAllController = new GetAllScheduleByUserController(getAllUseCase);
export const getByIdController = new GetByIdScheduleController(getByIdUseCase);
export const deleteController = new DeleteScheduleController(deleteUseCase);
export const updateController = new UpdateScheduleController(updateUseCase);