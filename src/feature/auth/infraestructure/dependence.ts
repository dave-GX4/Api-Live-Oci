import pool from "../../../core/config/data_base_conection";
import UuidService from "../../../core/services/implements/uuidService";
import SingInUseCase from "../applicaticon/usescases/sing_In_UseCase";
import SingUpUseCase from "../applicaticon/usescases/sing_up_UseCase";
import SingInController from "./controllers/sing_In_Controller";
import SingUpController from "./controllers/sing_Up_Controller";
import MySQLPersistence from "./db/MySQL_persistence";
import BcryptEncryptService from "../../../core/services/implements/bcrypt_encrypt_service";

const mysqlPersistence = new MySQLPersistence(pool)
const uuidService = new UuidService()
const bcryptService = new BcryptEncryptService()

const singUpUseCase = new SingUpUseCase(mysqlPersistence, uuidService, bcryptService)
const singInUseCase = new SingInUseCase(mysqlPersistence, bcryptService)

export const singUpController = new SingUpController(singUpUseCase)
export const singInController = new SingInController(singInUseCase)

