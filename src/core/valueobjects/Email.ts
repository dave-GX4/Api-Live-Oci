import InvalidError from "../errors/InvalidError";

export default class Email {
    private readonly value: string;

    private static readonly ALLOWED_DOMAINS = [
        'gmail.com',
        'outlook.com',
    ];

    private constructor(value: string) {
        this.value = value;
    }

    public static validated(value: string): Email {
        const trimmedValue = value.trim().toLowerCase();

        if (!this.isValidFormat(trimmedValue)) {
            throw new InvalidError('El formato del email no es válido.');
        }

        if (!this.isDomainAllowed(trimmedValue)) {
            throw new InvalidError(`El dominio del email no está permitido. Solo se aceptan: ${this.ALLOWED_DOMAINS.join(', ')}`);
        }

        return new Email(trimmedValue);
    }

    private static isValidFormat(value: string): boolean {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(value);
    }

    private static isDomainAllowed(value: string): boolean {
        const domain = value.split('@')[1];
        return this.ALLOWED_DOMAINS.includes(domain);
    }

    public static fromDatabase(value: string): Email {
        return new Email(value)
    }

    public getValue(): string {
        return this.value;
    }
}