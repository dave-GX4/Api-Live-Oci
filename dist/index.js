"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./src/feature/auth/infraestructure/router/router"));
const router_2 = __importDefault(require("./src/feature/user/infraestructure/router/router"));
const router_3 = __importDefault(require("./src/feature/activity/infraestructure/router/router"));
const RouterSchedule_1 = __importDefault(require("./src/feature/schedule/infraestructure/router/RouterSchedule"));
const router_4 = __importDefault(require("./src/feature/leisurerecord/infraestructure/router/router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.SERVER_PORT;
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
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
