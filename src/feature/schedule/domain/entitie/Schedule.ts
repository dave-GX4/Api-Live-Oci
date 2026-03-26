import UUID from "../../../../core/valueobjects/UUID"

export default interface Schedule{
    uuid: UUID
    uuidUser: UUID
    title: string
    days: number[]
    startTime: string
    endTime: string
    active: boolean
    type: string
}