export default class ConfigurationError extends Error {
    constructor(variableName: string) {
        super(`[FATAL] La variable de entorno ${variableName} no está definida o es inválida.`);
        this.name = "ConfigurationError";
    }
}