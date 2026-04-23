export default interface ICodeService {
    generateUniqueCode(): Promise<string>;
    calculateExpirationDate(): Date;
}