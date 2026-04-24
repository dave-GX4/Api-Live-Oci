import { Response } from "express"

export default interface IFriendRequestConnectionManager{
    addClient(userId: string, res: Response): void
    removeClient(userId: string): void
}