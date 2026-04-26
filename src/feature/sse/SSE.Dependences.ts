import GlobalStreamController from "./controller/GlobalStream.Controller";
import GlobalSseManager from "./service/GlobalSseManager";

const sseService = new GlobalSseManager()

export const globalStreamController = new GlobalStreamController(sseService)