import LeisureRecord from "./entitie/LeisureRecord"

export default interface LeisureRecordRepository{
    addActivity(leisureRecord: LeisureRecord): Promise<void>
    getAllByUser(id:string): Promise<LeisureRecord[]>
    getById(id: string): Promise<LeisureRecord | null>
    deleteActivityComplete(id: string): Promise<void>
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