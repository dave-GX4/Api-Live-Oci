import InvalidError from "../errors/InvalidError";

export default class UUID {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static validate(value: string): UUID {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!regex.test(value)) {
            throw new InvalidError('El uuid no es valido');
        }

        return new UUID(value);
    }

    public static fromDatabase(value: string): UUID {
        return new UUID(value);
    }

    public getValue(): string {
        return this.value;
    }
}