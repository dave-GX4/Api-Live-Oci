import { env } from "../../../core/config/env.config";
import GetActivityByKeyUseCase from "../application/usescases/GetActivityByKey.UseCase";
import GetFilterActivityUseCase from "../application/usescases/GetFilterActivity.UseCase";
import GetRandomUseCase from "../application/usescases/GetRandom.UseCase";
import GetActivityByKeyController from "./controllers/GetActivityByKeyController";
import GetFilterActivityController from "./controllers/GetFilterActivity.Controller";
import GetRandomController from "./controllers/GetRandom.Controller";
import BoredService from "./external/BoredApi.Service";

const boredService = new BoredService(env.externalApis.bored)

const getRandomUseCase = new GetRandomUseCase(boredService)
const getKeyUseCase = new GetActivityByKeyUseCase(boredService)
const getFilterUseCase = new GetFilterActivityUseCase(boredService)

export const getKeyController= new GetActivityByKeyController(getKeyUseCase)
export const getRandomController = new GetRandomController(getRandomUseCase)
export const getFilterController = new GetFilterActivityController(getFilterUseCase)