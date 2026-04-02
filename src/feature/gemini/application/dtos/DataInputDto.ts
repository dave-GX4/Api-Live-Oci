export default interface DataInputDto{
    name: string;
    interests: string[] | string;
    topics: string[] | string;
    description: string;
    leisureType: string;
    activityTemplate: string;
    typeTemplate: string;
    participantsTemplate: number;
    durationTemplate: string;
    kidFriendlyTemplate: boolean;
}