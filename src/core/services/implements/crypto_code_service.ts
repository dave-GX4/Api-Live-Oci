import crypto from 'crypto';
import CodeService from "../interface/codeService";

export default class CryptoCodeGenerator implements CodeService {
    private readonly CODE_LENGTH = 12;
    private readonly EXPIRATION_MONTHS = 8;

    async generateUniqueCode(): Promise<string> {
        const bytes = crypto.randomBytes(8);
        const raw = bytes.toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase()
            .substring(0, this.CODE_LENGTH);
        
        return `${raw.substring(0,4)}-${raw.substring(4,8)}-${raw.substring(8,12)}`;
    }

    calculateExpirationDate(): Date {
        const date = new Date();
        date.setMonth(date.getMonth() + this.EXPIRATION_MONTHS);
        return date;
    }
}