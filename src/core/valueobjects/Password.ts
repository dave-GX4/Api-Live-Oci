import InvalidError from "../errors/InvalidError";

export default class Password {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static validated(value: string): Password {
        if (!this.isValid(value)) {
            throw new InvalidError('La contraseña debe tener al menos una mayúscula, una minúscula y un número.');
        }

        if (value.length < 8) throw new InvalidError('La contraseña debe tener al menos 8 caracteres.');

        return new Password(value);
    }

    private static isValid(value: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]+$/;
        return regex.test(value);
    }

    public static fromDatabase(value: string): Password {
        return new Password(value)
    }

    public static convert(value: string): Password {
        return new Password(value)
    }

    public getValue(): string {
        return this.value;
    }
}