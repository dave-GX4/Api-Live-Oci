import pool from "../../../core/config/data.base.conection";
import UuidService from "../../../core/services/implements/uuidService";
import SingInUseCase from "../applicaticon/usescases/Sing.In.UseCase";
import SingUpUseCase from "../applicaticon/usescases/Sing.Up.UseCase";
import SingInController from "./controllers/Sing.In.Controller";
import SingUpController from "./controllers/Sing.Up.Controller";
import MySQLPersistence from "./db/MySQL.persistence.Auth";
import BcryptEncryptService from "../../../core/services/implements/bcrypt_encrypt_service";

const mysqlPersistence = new MySQLPersistence(pool)
const uuidService = new UuidService()
const bcryptService = new BcryptEncryptService()

const singUpUseCase = new SingUpUseCase(mysqlPersistence, uuidService, bcryptService)
const singInUseCase = new SingInUseCase(mysqlPersistence, bcryptService)

export const singUpController = new SingUpController(singUpUseCase)
export const singInController = new SingInController(singInUseCase)

