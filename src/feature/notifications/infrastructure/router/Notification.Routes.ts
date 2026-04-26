import { Request, Response, Router } from "express";
import { getNotificationsController, markAllNotificationsReadController, markNotificationReadController } from "../Notification.Dependences";

const routerNotification = Router()

routerNotification.patch(
    "/user/:userId/read-all",
    (req: Request, res: Response) => markAllNotificationsReadController.run(req, res)
);

routerNotification.patch(
    "/:id/read",
    (req: Request, res: Response) => markNotificationReadController.run(req, res)
);

routerNotification.get(
    "/:userId",
    (req: Request, res: Response) => getNotificationsController.run(req, res)
);

export default routerNotification;