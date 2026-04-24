import { Response } from 'express';

export default interface ICodeConnectionManager {
    addClient(userId: string, res: Response): void;
    removeClient(userId: string): void;
}