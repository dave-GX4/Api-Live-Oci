import { Request, Response, Router } from "express";
import { cancelFriendRequestController, friendRequestUpdateController, getFriendsListController, getPendingFriendRequestsController, removeFriendController, sendFriendRequestController, streamFriendRequestController } from "../FriendRequest.Dependence";

const routerFriend = Router();

routerFriend.post(
    "/request",
    (req: Request, res: Response) => sendFriendRequestController.run(req, res)
);

routerFriend.patch(
    "/update/:id",
    (req: Request, res: Response) => friendRequestUpdateController.run(req, res)
);

routerFriend.delete(
    "/cancel/:id",
    (req: Request, res: Response) => cancelFriendRequestController.run(req, res)
);

routerFriend.get(
    "/get/pending/:id",
    (req: Request, res: Response) => getPendingFriendRequestsController.run(req, res)
);

routerFriend.get(
    "/stream/:id",
    (req: Request, res: Response) => streamFriendRequestController.run(req, res)
);

routerFriend.get(
    '/get/all/:userId', 
    (req: Request, res: Response) => getFriendsListController.run(req, res)
);

routerFriend.delete(
    '/delete/:friendshipId', 
    (req: Request, res: Response) => removeFriendController.run(req, res)
);

export default routerFriend; 