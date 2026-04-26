import { Request, Response, Router } from "express";
import { getController, searchController } from "../Code.Dependences";

const routerCode = Router()

routerCode.get(
    "/get/:id", 
    (req: Request, res: Response) => getController.run(req, res)
);

routerCode.post(
    "/search/:id",
    (req: Request, res: Response) => searchController.run(req, res)
);

export default routerCode;