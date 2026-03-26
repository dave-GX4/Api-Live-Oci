export class DatabaseOperationError extends Error {
    constructor(originalError: any) {
        super('Error inesperado en la base de datos.');
        this.name = 'DatabaseOperationError';
        console.error(originalError);
    }
}