import pool from "../../../core/config/data.base.conection";
import UuidService from "../../../core/services/implements/Uuid.Service";
import SingInUseCase from "../application/usescases/Sing.In.UseCase";
import SingUpUseCase from "../application/usescases/Sing.Up.UseCase";
import SingInController from "./controllers/Sing.In.Controller";
import SingUpController from "./controllers/Sing.Up.Controller";
import MySQLPersistence from "./db/MySQL.persistence.Auth";
import BcryptEncryptService from "../../../core/services/implements/BcryptEncrypt.Service";
import CodeMySqlPersistence from "../../code/infrastructure/db/Code.MySql.Persistence";
import CryptoCodeGenerator from "../../../core/services/implements/CryptoCode.Service";

const mysqlPersistence = new MySQLPersistence(pool)
const codeMySqlPersistence = new CodeMySqlPersistence(pool);
const uuidService = new UuidService()
const bcryptService = new BcryptEncryptService()
const cryptoCodeService = new CryptoCodeGenerator();

const singUpUseCase = new SingUpUseCase(
    mysqlPersistence, 
    uuidService, 
    bcryptService,
    codeMySqlPersistence,
    cryptoCodeService
)
const singInUseCase = new SingInUseCase(mysqlPersistence, bcryptService)

export const singUpController = new SingUpController(singUpUseCase)
export const singInController = new SingInController(singInUseCase)

