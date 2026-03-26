export class NotFoundError extends Error {
    constructor(
        resource: string,      // ej: "Usuario", "Producto", "Post"
        identifier?: string,   // ej: "anton@gsywe.com", "ID 123"
        field: string = 'id'   // ej: "email", "UUID", "slug"
    ) {
        const msg = identifier 
            ? `No se encontró ${resource.toLowerCase()} con ${field}: ${identifier}`
            : `${resource} no encontrado`;
            
        super(msg);
        this.name = 'NotFoundError';
    }
}