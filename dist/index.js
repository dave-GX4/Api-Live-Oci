"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./src/feature/auth/infraestructure/router/router"));
const router_2 = __importDefault(require("./src/feature/user/infraestructure/router/router"));
const router_3 = __importDefault(require("./src/feature/activity/infraestructure/router/router"));
const RouterSchedule_1 = __importDefault(require("./src/feature/schedule/infraestructure/router/RouterSchedule"));
const router_4 = __importDefault(require("./src/feature/leisurerecord/infraestructure/router/router"));
const GeminiRouter_1 = __importDefault(require("./src/feature/gemini/infraestructure/routes/GeminiRouter"));
const BoredRouter_1 = __importDefault(require("./src/feature/bored/infraestructure/routes/BoredRouter"));
const env_config_1 = require("./src/core/config/env.config");
const app = (0, express_1.default)();
const corsOptions = {
    origin: '*',
    methods: ['POST'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/v1/auth', router_1.default);
app.use('/api/v1/user', router_2.default);
app.use('/api/v1/activities', router_3.default);
app.use('/api/v1/schedules', RouterSchedule_1.default);
app.use('/api/v1/LR', router_4.default);
app.use('/api/v1/gemini', GeminiRouter_1.default);
app.use('/api/v1/bored', BoredRouter_1.default);
app.listen(env_config_1.env.server.port, () => {
    console.log(`[${env_config_1.env.server.nodeEnv}] Servidor corriendo en el puerto ${env_config_1.env.server.port}`);
});
