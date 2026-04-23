export default interface IUuidService {
    generate(): Promise<string>;
}