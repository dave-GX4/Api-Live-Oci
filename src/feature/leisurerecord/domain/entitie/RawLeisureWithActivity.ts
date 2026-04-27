import UUID from "../../../../core/valueobjects/UUID";

export default interface RawLeisureWithActivity {
    leisureUuid: UUID;
    scheduleDate: Date | null;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    satisfaction: number;
    status: string;
    createdAt: Date;
    
    activityUuid: UUID;
    activityName: string;
    activityImageUrl: string;
    activityDescription: string;
    activityType: string;
    activityCategory: string;
    activityEstimatedDuration: number;
    socialType: string;
}