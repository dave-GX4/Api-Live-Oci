export default class ExternalApiError extends Error {
    constructor(
        public readonly serviceName: string,
        public readonly details: string
    ) {
        super(`Error en el servicio externo [${serviceName}]: ${details}`);
        this.name = "ExternalApiError";
    }
}