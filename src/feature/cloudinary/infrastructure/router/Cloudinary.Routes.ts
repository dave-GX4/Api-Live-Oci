import { Request, Response, Router } from "express";
import multer from "multer";
import { deleteController, getController, saveController } from "../Cloudinary.Dependences";

const upload = multer({ storage: multer.memoryStorage() });
const routerCloudinary = Router()

routerCloudinary.put(
    '/:userId/photo', 
    upload.single('file'), 
    (req: Request, res: Response) => saveController.run(req, res)
);

routerCloudinary.get(
    '/:userId/photo', 
    (req: Request, res: Response) => 
        getController.run(req, res)
);

routerCloudinary.delete(
    '/:userId/photo', 
    (req: Request, res: Response) => 
        deleteController.run(req, res)
);

export default routerCloudinary;