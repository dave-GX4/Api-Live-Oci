import UUID from "../../../../core/valueobjects/UUID"

export default interface LeisureRecord{
    uuid: UUID
    uuidUser: UUID
    uuidActivity: UUID
    scheduleDate?: Date
    startTime: string
    endTime: string
    durationMinutes: number
    satisfaction: number
    status: string
    createAt?: Date
}