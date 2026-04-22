import { Request, Response, Router } from "express";
import { getController } from "../Code.Dependences";

const routerCode = Router()

routerCode.get(
    "/stream/:id", 
    (req: Request, res: Response) => getController.streamCode(req, res)
);

export default routerCode;