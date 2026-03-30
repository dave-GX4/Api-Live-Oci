"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dependences_1 = require("../Dependences");
const routerBored = (0, express_1.Router)();
routerBored.get("/external/random", (req, res) => Dependences_1.getRandomController.run(req, res));
routerBored.get("/external/filter", (req, res) => Dependences_1.getFilterController.run(req, res));
routerBored.get("/external/:key", (req, res) => Dependences_1.getKeyController.run(req, res));
exports.default = routerBored;
