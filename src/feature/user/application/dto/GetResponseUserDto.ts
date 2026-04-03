export default interface GetResponseUserDto {
    id: string; 
    name: string;
    email: string;
    notifications: boolean;
    interests: string[];
    topics: string[];
    description: string;
    leisureType: string;
}