import { v4 as uuidv4 } from 'uuid';

export default class UuidService implements UuidService {
    async generate(): Promise<string> {
        return uuidv4();
    }
}