export default interface GetResponseUserDto {
    name: string;
    email: string;
    notifications: boolean;
    interests: string[];
    topics: string[];
    description: string;
    leisureType: string;
}