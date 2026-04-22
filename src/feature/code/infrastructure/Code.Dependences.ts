import pool from "../../../core/config/data.base.conection";
import CryptoCodeGenerator from "../../../core/services/implements/crypto_code_service";
import GetFriendCodeUseCase from "../application/usecases/GetFriendCode.UseCase";
import RegenerateFriendCodeUseCase from "../application/usecases/RegenerateFriendCode.UseCase";
import GetCodeController from "./controllers/GetCode.Controller";
import { CodeExpirationCron } from "./cron/CodeExpiration.Cron";
import CodeMySqlPersistence from "./db/Code.MySql.Persistence";
import SseConnectionManager from "./services/impl/SseConnectionManager";

const codeMySqlPersistence = new CodeMySqlPersistence(pool);
const cryptoCodeService = new CryptoCodeGenerator();
const sseConnectionManager = new SseConnectionManager();

const getUseCase = new GetFriendCodeUseCase(codeMySqlPersistence);
const regenerateUseCase = new RegenerateFriendCodeUseCase(
    codeMySqlPersistence,
    cryptoCodeService,
    sseConnectionManager
);

export const getController = new GetCodeController(
    getUseCase,
    sseConnectionManager
)

export const codeExpirationCron = new CodeExpirationCron(
    regenerateUseCase,
    codeMySqlPersistence
);