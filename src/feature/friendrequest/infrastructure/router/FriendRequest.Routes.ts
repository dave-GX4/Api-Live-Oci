import { Request, Response, Router } from "express";
import { sendFriendRequestController } from "../FriendRequest.Dependence";

const routerFriendRequest = Router();

routerFriendRequest.post(
    "/request",
    (req: Request, res: Response) => sendFriendRequestController.run(req, res)
);

export default routerFriendRequest;