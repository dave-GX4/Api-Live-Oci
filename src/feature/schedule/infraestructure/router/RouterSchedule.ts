import { Request, Response, Router } from "express";
import { addController, deleteController, getAllController, getByIdController, updateController } from "../Dependences";

const routerSchedule = Router();

routerSchedule.post(
    "/add/:id",
    (req: Request, res: Response) => addController.run(req, res)
);

routerSchedule.get(
    "/get/:id",
    (req: Request, res: Response) => getByIdController.run(req, res)
);

routerSchedule.get(
    "/allSchedules/:id",
    (req: Request, res: Response) => getAllController.run(req, res)
);

routerSchedule.delete(
    "/delete/:id",
    (req: Request, res: Response) => deleteController.run(req, res)
);

routerSchedule.patch(
    "/update/:id",
    (req: Request, res: Response) => updateController.run(req, res)
);

export default routerSchedule;
