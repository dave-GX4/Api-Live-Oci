"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dependences_1 = require("../Dependences");
const routerActivity = (0, express_1.Router)();
routerActivity.post("/newActivity/:id", (req, res) => Dependences_1.createController.run(req, res));
routerActivity.get("/AllActivities/:id", (req, res) => Dependences_1.getAllController.run(req, res));
routerActivity.delete("/killActivity/:id", (req, res) => Dependences_1.deleteController.run(req, res));
exports.default = routerActivity;
