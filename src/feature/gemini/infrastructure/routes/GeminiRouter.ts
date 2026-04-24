import { Request, Response, Router } from "express";
import { generateActivityController } from "../Dependences";

const routerGemini = Router();

routerGemini.post(
    "/generate/:id", 
    (req: Request, res: Response) => generateActivityController.run(req, res)
);

export default routerGemini;