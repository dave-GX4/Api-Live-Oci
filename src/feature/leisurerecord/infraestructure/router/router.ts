import { Request, Response, Router } from "express";
import { addController, deleteController, getAllController } from "../Dependences";

const routerLeisureRecords = Router();

routerLeisureRecords.post(
    "/addLeisureRecords",
    (req: Request, res: Response) => addController.run(req, res)
);

routerLeisureRecords.get(
    "/allLeisureRecords/:id",
    (req: Request, res: Response) => getAllController.run(req, res)
);

routerLeisureRecords.delete(
    "/deleteLeisureRecord/:id",
    (req: Request, res: Response) => deleteController.run(req, res)
);

export default routerLeisureRecords;