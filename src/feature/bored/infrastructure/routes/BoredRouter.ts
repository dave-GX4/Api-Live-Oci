import { Request, Response, Router } from "express";
import { getFilterController, getKeyController, getRandomController } from "../Dependences";

const routerBored = Router()

routerBored.get(
    "/external/random",
    (req: Request, res: Response) => getRandomController.run(req, res)
);

routerBored.get(
    "/external/filter",
    (req: Request, res: Response) => getFilterController.run(req, res)
);

routerBored.get(
    "/external/:key",
    (req: Request, res: Response) => getKeyController.run(req, res)
);

export default routerBored;