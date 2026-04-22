export default interface CodeService {
    generateUniqueCode(): Promise<string>;
    calculateExpirationDate(): Date;
}