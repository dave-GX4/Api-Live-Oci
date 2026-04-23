import { Request, Response, Router } from "express";
import { cancelFriendRequestController, friendRequestUpdateController, sendFriendRequestController } from "../FriendRequest.Dependence";

const routerFriendRequest = Router();

routerFriendRequest.post(
    "/request",
    (req: Request, res: Response) => sendFriendRequestController.run(req, res)
);

routerFriendRequest.patch(
    "/update/:id",
    (req: Request, res: Response) => friendRequestUpdateController.run(req, res)
);

routerFriendRequest.delete(
    "/cancel/:id",
    (req: Request, res: Response) => cancelFriendRequestController.run(req, res)
)

export default routerFriendRequest;