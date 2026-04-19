import { Request } from "express";

export default interface MulterRequest extends Request {
    file?: Express.Multer.File;
}