import pool from "../../../core/config/data.base.conection";
import MySqlActivityPersistence from "../../activity/infrastructure/db/MySql.Activity.Persistence";
import GetAllLeisureRecordByUserUseCase from "../application/usescases/GetAllLeisureWithActivities.UseCase";
import UpdateLeisureRecordUseCase from "../application/usescases/UpdateLeisureRecord.UseCase";
import GetAllLeisureWithActivitiesController from "./controllers/GetAllLeisureRecordByUser.Controller";
import UpdateLeisureRecordController from "./controllers/UpdateLeisureRecord.Controller";
import MySqlLeisureRecordPersistence from "./db/MySql.LeisureRecord.Persistence";

const mySqlLeisureRecordsPercistence = new MySqlLeisureRecordPersistence(pool);
const mySqlActivityPersistence = new MySqlActivityPersistence(pool)

const getAllUseCase = new GetAllLeisureRecordByUserUseCase(
    mySqlLeisureRecordsPercistence,
);
const updateUseCase = new UpdateLeisureRecordUseCase(mySqlLeisureRecordsPercistence);

export const getAllController = new GetAllLeisureWithActivitiesController(getAllUseCase);
export const updateController = new UpdateLeisureRecordController(updateUseCase);