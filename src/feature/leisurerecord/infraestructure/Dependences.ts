import pool from "../../../core/config/data_base_conection";
import UuidService from "../../../core/services/implements/uuidService";

import AddLeisureRecordUseCase from "../application/usescases/AddLeisureRecord.UseCase";
import DeleteLeisureRecordUseCase from "../application/usescases/DeleteLeisureRecord.UseCase";
import GetAllLeisureRecordByUserUseCase from "../application/usescases/GetAllLeisureRecordByUser.UseCase";

import AddLeisureRecordController from "./controllers/AddLeisureRecord.Controller";
import DeleteLeisureRecordController from "./controllers/DeleteLeisureRecord.Controller";
import GetAllLeisureRecordByUserController from "./controllers/GetAllLeisureRecordByUser.Controller";
import MySqlLeisureRecordPersistence from "./db/MySql.LeisureRecord.Persistence";

const mySqlLeisureRecordsPercistence = new MySqlLeisureRecordPersistence(pool);
const serviceUuid = new UuidService();

const addUseCase = new AddLeisureRecordUseCase(mySqlLeisureRecordsPercistence, serviceUuid);
const getAllUseCase = new GetAllLeisureRecordByUserUseCase(mySqlLeisureRecordsPercistence);
const deleteUseCase = new DeleteLeisureRecordUseCase(mySqlLeisureRecordsPercistence);

export const addController = new AddLeisureRecordController(addUseCase);
export const getAllController = new GetAllLeisureRecordByUserController(getAllUseCase);
export const deleteController = new DeleteLeisureRecordController(deleteUseCase);
