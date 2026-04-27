import { Request, Response, Router } from "express";
import { getAllController, updateController } from "../LeisureRecord.Dependences";

const routerLeisureRecords = Router();

routerLeisureRecords.get(
    "/allLeisureRecords/:id",
    (req: Request, res: Response) => getAllController.run(req, res)
);

routerLeisureRecords.patch(
    "/update/:id",
    (req: Request, res: Response) => updateController.run(req, res)
);

export default routerLeisureRecords;