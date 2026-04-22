import { Request, Response, Router } from "express";
import { deleteController, getAllController, updateController } from "../Dependences";

const routerLeisureRecords = Router();

routerLeisureRecords.get(
    "/allLeisureRecords/:id",
    (req: Request, res: Response) => getAllController.run(req, res)
);

routerLeisureRecords.delete(
    "/deleteLeisureRecord/:id",
    (req: Request, res: Response) => deleteController.run(req, res)
);

routerLeisureRecords.patch(
    "/update/:id",
    (req: Request, res: Response) => updateController.run(req, res)
);

export default routerLeisureRecords;