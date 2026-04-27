import LeisureRecord from "./entitie/LeisureRecord"
import RawLeisureWithActivity from "./entitie/RawLeisureWithActivity";

export default interface LeisureRecordRepository{
    addActivity(leisureRecord: LeisureRecord): Promise<void>
    getById(id: string): Promise<LeisureRecord | null>
    getAllWithActivityByUser(uuidUser: string): Promise<RawLeisureWithActivity[]>;
    updateLeisureRecord(
        id: string,
        updates: Partial<{
            scheduleDate?: Date;
            startTime?: string;
            endTime?: string;
            durationMinutes?: number;
            satisfaction?: number;
            status?: string;
        }>
    ): Promise<void>
}