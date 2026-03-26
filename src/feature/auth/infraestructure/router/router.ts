import { Request, Response, Router } from "express";
import { singInController, singUpController } from "../dependence";

const routerAuth = Router();

routerAuth.post(
    "/singin", 
    (req: Request, res: Response) => singInController.run(req, res)
);

routerAuth.post(
    "/singup", 
    (req: Request, res: Response) => singUpController.run(req, res)
);

export default routerAuth;