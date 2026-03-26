import UUID from "../../../../core/valueobjects/UUID"

export default interface Schedule{
    id: UUID
    id_user: UUID
    title: string
    days: number[]
    start_time: string
    end_time: string
    active: boolean
    type: string
}