import cors from 'cors';
import express from "express";
import routerAuth from "./src/feature/auth/infrastructure/router/router";
import routerUser from "./src/feature/user/infrastructure/router/router";
import routerActivity from "./src/feature/activity/infrastructure/router/router";
import routerSchedule from "./src/feature/schedule/infrastructure/router/RouterSchedule";
import routerLeisureRecords from "./src/feature/leisurerecord/infrastructure/router/router";
import routerGemini from "./src/feature/gemini/infrastructure/routes/GeminiRouter";
import routerBored from './src/feature/bored/infrastructure/routes/BoredRouter';
import { env } from './src/core/config/env.config';
import routerCloudinary from './src/feature/cloudinary/infrastructure/router/Cloudinary.Routes';
import { codeExpirationCron } from './src/feature/code/infrastructure/Code.Dependences';
import routerCode from './src/feature/code/infrastructure/router/Code.Routes';
import routerFriendRequest from './src/feature/friendrequest/infrastructure/router/FriendRequest.Routes';

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}

const routeGlobal = "/api/v2/";

app.use(cors(corsOptions));
app.use(express.json());

app.use(`${routeGlobal}auth`, routerAuth);
app.use(`${routeGlobal}user`, routerUser);
app.use(`${routeGlobal}activities`, routerActivity);
app.use(`${routeGlobal}schedules`, routerSchedule);
app.use(`${routeGlobal}LR`, routerLeisureRecords);
app.use(`${routeGlobal}gemini`, routerGemini);
app.use(`${routeGlobal}bored`, routerBored);
app.use(`${routeGlobal}cloudinary`, routerCloudinary);
app.use(`${routeGlobal}code`, routerCode);
app.use(`${routeGlobal}friends`, routerFriendRequest)

app.listen(env.server.port, () => {
    console.log(`[${env.server.nodeEnv}] Servidor corriendo en el puerto ${env.server.port}`);
    codeExpirationCron.start(); 
});