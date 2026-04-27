export interface LeisureWithActivityDto {
    leisureUuid: string;
    scheduleDate?: Date;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    satisfaction: number;
    status: string;
    activityUuid: string;
    activityName: string;
    activityDescription: string;
    activityType: string;
    activityCategory: string;
    activityEstimatedDuration: number;
    socialType: string;
}