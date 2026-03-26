export default interface UuidService {
    generate(): Promise<string>;
}