import pool from "../../../core/config/data.base.conection";
import UuidService from "../../../core/services/implements/uuidService";
import MySqlLeisureRecordPersistence from "../../leisurerecord/infraestructure/db/MySql.LeisureRecord.Persistence";
import CreateActivityUseCase from "../application/usecases/CreateActivity.UseCases";
import DeleteActivityUseCase from "../application/usecases/DeleteActivity.UseCase";
import GetAllActivitiesByUserUseCase from "../application/usecases/GetAllActivitiesByUser.UseCase";
import CreateActivityController from "./constrollers/CreateActivity.Controller";
import DeleteActivityController from "./constrollers/DeleteActivity.Controller";
import GetAllActivitiesByUserController from "./constrollers/GetAllActivitiesByUser.Controller";
import MySqlActivityPersistence from "./db/MySql.Activity.Persistence";

const mySqlActivityPersistence = new MySqlActivityPersistence(pool)
const mySqlLRPersistence = new MySqlLeisureRecordPersistence(pool)

const serviceUid = new UuidService()

const createUseCase = new CreateActivityUseCase(
    mySqlActivityPersistence,
    mySqlLRPersistence,
    serviceUid
);
const deleteUseCase = new DeleteActivityUseCase(mySqlActivityPersistence);
const getAllUseCase = new GetAllActivitiesByUserUseCase(mySqlActivityPersistence);

export const createController = new CreateActivityController(createUseCase);
export const getAllController = new GetAllActivitiesByUserController(getAllUseCase);
export const deleteController = new DeleteActivityController(deleteUseCase);