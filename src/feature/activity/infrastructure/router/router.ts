import { Request, Response, Router } from "express";
import { createController, deleteController, getAllController } from "../Dependences";

const routerActivity = Router();

routerActivity.post(
    "/newActivity/:id",
    (req: Request, res: Response) => createController.run(req, res)
);

routerActivity.get(
    "/AllActivities/:id",
    (req: Request, res: Response) => getAllController.run(req, res)
);

routerActivity.delete(
    "/killActivity/:id",
    (req: Request, res: Response) => deleteController.run(req, res)
);

export default routerActivity;