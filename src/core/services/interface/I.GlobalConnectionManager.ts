import { Response } from 'express';

export default interface IGlobalConnectionManager{
    addClient(userId: string, res: Response): void
    removeClient(userId: string): void
}