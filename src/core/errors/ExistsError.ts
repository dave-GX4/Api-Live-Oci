export class ExistsError extends Error {
    constructor(email: string) {
        super(`El usuario con email ${email} ya está registrado.`);
        this.name = 'UserAlreadyExistsError';
    }
}