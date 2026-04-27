import pool from "../../../core/config/data.base.conection";
import UuidService from "../../../core/services/implements/Uuid.Service";
import MySqlLeisureRecordPersistence from "../../leisurerecord/infrastructure/db/MySql.LeisureRecord.Persistence";
import CreateActivityUseCase from "../application/usecases/CreateActivity.UseCases";
import DeleteActivityUseCase from "../application/usecases/DeleteActivity.UseCase";
import CreateActivityController from "./constrollers/CreateActivity.Controller";
import DeleteActivityController from "./constrollers/DeleteActivity.Controller";
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

export const createController = new CreateActivityController(createUseCase);
export const deleteController = new DeleteActivityController(deleteUseCase);