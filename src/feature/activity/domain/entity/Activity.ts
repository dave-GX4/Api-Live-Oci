import UUID from "../../../../core/valueobjects/UUID"

export default interface Activity{
    uuid: UUID
    uuidUser: UUID 
    name: string
    imageUrl?: string
    description: string
    type: string
    category: string
    durationMinutes: number
    socialType: string
}