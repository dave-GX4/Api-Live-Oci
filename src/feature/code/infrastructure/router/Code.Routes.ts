import { Request, Response, Router } from "express";
import { getController, searchController } from "../Code.Dependences";

const routerCode = Router()

routerCode.get(
    "/stream/:id", 
    (req: Request, res: Response) => getController.streamCode(req, res)
);

routerCode.get(
    "/search/:id",
    (req: Request, res: Response) => searchController.run(req, res)
)

export default routerCode;