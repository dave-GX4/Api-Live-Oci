import pool from "../../../core/config/data.base.conection";
import MySqlActivityPersistence from "../../activity/infrastructure/db/MySql.Activity.Persistence";

import DeleteLeisureRecordUseCase from "../application/usescases/DeleteLeisureRecord.UseCase";
import GetAllLeisureRecordByUserUseCase from "../application/usescases/GetAllLeisureRecordByUser.UseCase";
import UpdateLeisureRecordUseCase from "../application/usescases/UpdateLeisureRecord.UseCase";

import DeleteLeisureRecordController from "./controllers/DeleteLeisureRecord.Controller";
import GetAllLeisureRecordByUserController from "./controllers/GetAllLeisureRecordByUser.Controller";
import UpdateLeisureRecordController from "./controllers/UpdateLeisureRecord.Controller";
import MySqlLeisureRecordPersistence from "./db/MySql.LeisureRecord.Persistence";

const mySqlLeisureRecordsPercistence = new MySqlLeisureRecordPersistence(pool);
const mySqlActivityPersistence = new MySqlActivityPersistence(pool)

const getAllUseCase = new GetAllLeisureRecordByUserUseCase(mySqlLeisureRecordsPercistence);
const deleteUseCase = new DeleteLeisureRecordUseCase(mySqlLeisureRecordsPercistence, mySqlActivityPersistence);
const updateUseCase = new UpdateLeisureRecordUseCase(mySqlLeisureRecordsPercistence);

export const getAllController = new GetAllLeisureRecordByUserController(getAllUseCase);
export const deleteController = new DeleteLeisureRecordController(deleteUseCase);
export const updateController = new UpdateLeisureRecordController(updateUseCase);