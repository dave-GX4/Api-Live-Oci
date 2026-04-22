import { Response } from 'express';

export default interface IConnectionManager {
    addClient(userId: string, res: Response): void;
    removeClient(userId: string): void;
}