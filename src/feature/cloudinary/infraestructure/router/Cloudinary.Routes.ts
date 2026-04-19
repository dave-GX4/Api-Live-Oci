import { Request, Response, Router } from "express";
import multer from "multer";
import { deleteController, getController, updateController, uploadController } from "../Cloudinary.Dependences";

const upload = multer({ storage: multer.memoryStorage() });
const routerCloudinary = Router()

routerCloudinary.post(
    '/:userId/photo', 
    upload.single('file'), 
    (req: Request, res: Response) => 
        uploadController.run(req, res)
);

routerCloudinary.put(
    '/:userId/photo', 
    upload.single('file'), 
    (req: Request, res: Response) => 
        updateController.run(req, res)
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