import Email from "../../../../core/valueobjects/Email";
import Password from "../../../../core/valueobjects/Password";
import UUID from "../../../../core/valueobjects/UUID";

export default interface Auth {
    id: UUID;
    name: string;
    email: Email;
    password: Password;
}