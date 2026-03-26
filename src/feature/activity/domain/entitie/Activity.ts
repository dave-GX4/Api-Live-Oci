import UUID from "../../../../core/valueobjects/UUID"

export default interface Activity{
    id: UUID
    id_user: UUID 
    name: string
    description: string
    type: string
    category: string
    duration_minutes: number
    social_type: string
}