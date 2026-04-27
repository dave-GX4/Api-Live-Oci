import { Request, Response, Router } from "express";
import { createController, deleteController} from "../Activity.Dependences";

const routerActivity = Router();

routerActivity.post(
    "/newActivity/:id",
    (req: Request, res: Response) => createController.run(req, res)
);

routerActivity.delete(
    "/killActivity/:id",
    (req: Request, res: Response) => deleteController.run(req, res)
);

export default routerActivity;