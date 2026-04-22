import { Request, Response, Router } from "express";
import { deleteController, getByIdController, updateController } from "../Dependences";

const routerUser = Router()

routerUser.get(
    "/get/:id", 
    (req: Request, res: Response) => getByIdController.run(req, res)
);

routerUser.patch(
    "/update/:id",
    (req: Request, res: Response) => updateController.run(req, res)
);

routerUser.delete(
    "/delete/:id",
    (req: Request, res: Response) => deleteController.run(req, res)
);

export default routerUser;