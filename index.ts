import cors from 'cors';
import express from "express";
import routerAuth from "./src/feature/auth/infraestructure/router/router";
import routerUser from "./src/feature/user/infraestructure/router/router";
import routerActivity from "./src/feature/activity/infraestructure/router/router";
import routerSchedule from "./src/feature/schedule/infraestructure/router/RouterSchedule";
import routerLeisureRecords from "./src/feature/leisurerecord/infraestructure/router/router";
import routerGemini from "./src/feature/gemini/infraestructure/routes/GeminiRouter";
import routerBored from './src/feature/bored/infraestructure/routes/BoredRouter';
import { env } from './src/core/config/env.config';

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['POST'],
}
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/auth', routerAuth);
app.use('/api/v1/user', routerUser);
app.use('/api/v1/activities', routerActivity);
app.use('/api/v1/schedules', routerSchedule);
app.use('/api/v1/LR', routerLeisureRecords);
app.use('/api/v1/gemini', routerGemini);
app.use('/api/v1/bored', routerBored);

app.listen(env.server.port, () => {
    console.log(`[${env.server.nodeEnv}] Servidor corriendo en el puerto ${env.server.port}`);
});