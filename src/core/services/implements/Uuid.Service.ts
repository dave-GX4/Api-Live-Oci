import { v4 as uuidv4 } from 'uuid';
import IUuidService from '../interface/I.Uuid.Service';

export default class UuidService implements IUuidService {
    async generate(): Promise<string> {
        return uuidv4();
    }
}