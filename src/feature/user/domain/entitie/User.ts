import Email from "../../../../core/valueobjects/Email"
import Password from "../../../../core/valueobjects/Password"
import UUID from "../../../../core/valueobjects/UUID"

export default interface User {
    uuid: UUID
    name: string
    email: Email
    password: Password
    notifications: boolean
    interests: string[]
    topics: string[]
    description: string
    leisure_type: string
}