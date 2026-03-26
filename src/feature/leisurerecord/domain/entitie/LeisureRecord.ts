import UUID from "../../../../core/valueobjects/UUID"

export default interface LeisureRecord{
    id: UUID
    id_user: UUID
    id_activitie: UUID
    schedule_date?: Date
    start_time: string
    end_time: string
    duration_minutes: number
    saticfaction: number
    status: string
}