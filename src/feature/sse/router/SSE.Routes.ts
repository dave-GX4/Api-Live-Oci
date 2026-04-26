import { Request, Response, Router } from "express";
import { globalStreamController } from "../SSE.Dependences";

const routerGlobalSse = Router()

routerGlobalSse.get(
    '/stream/:id', 
    (req: Request, res: Response) => globalStreamController.run(req, res)
);

export default routerGlobalSse;