import Schedule from "./entitie/Schedule";

export default interface ScheduleRepository{
    addSchedule(schedule: Schedule): Promise<void>
    getAllSchedulesByUser(uuidUser: string): Promise<Schedule[]>
    getByIdSchedule(id: string): Promise<Schedule | null>
    deleteSchedule(id: string): Promise<void>
    updatenSchedule(
        id: string, 
        updates: Partial<{
            title: string,
            days: number[],
            startTime: string,
            endTime: string,
            active: boolean
        }>
    ): Promise<void>
}