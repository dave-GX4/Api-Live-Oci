import GeminiService from "./external/GeminiApi.Service";
import GenerateActivityUseCase from "../application/usescases/GenerateActivity.UseCase";
import MySqlActivityPersistence from "../../activity/infraestructure/db/MySql.Activity.Persistence";
import MySqlLeisureRecordPersistence from "../../leisurerecord/infraestructure/db/MySql.LeisureRecord.Persistence";
import pool from "../../../core/config/data.base.conection";
import UuidService from "../../../core/services/implements/uuidService";
import GenerateActivityController from "./controller/GenerateActivity.Controller";
import { env } from "../../../core/config/env.config";
import MySqlUserPersistence from "../../user/infraestructure/db/MySql.User.Persistence";

const mySqlActivityPersistence = new MySqlActivityPersistence(pool);
const mySqlLRPersistence = new MySqlLeisureRecordPersistence(pool);
const mySqlUserPersistence = new MySqlUserPersistence(pool);

const serviceUid = new UuidService();
const geminiService = new GeminiService(env.externalApis.gemini);

export const generateActivityUseCase = new GenerateActivityUseCase(
    mySqlActivityPersistence,
    mySqlLRPersistence,
    mySqlUserPersistence,
    geminiService,
    serviceUid
);

export const generateActivityController = new GenerateActivityController(generateActivityUseCase);