import UUID from "../../../../core/valueobjects/UUID";

export default interface RawLeisureWithActivity {
    leisureUuid: UUID;
    scheduleDate: Date | null;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    satisfaction: number;
    status: string;
    activityUuid: UUID;
    activityName: string;
    activityDescription: string;
    activityType: string;
    activityCategory: string;
    activityEstimatedDuration: number;
    socialType: string;
}