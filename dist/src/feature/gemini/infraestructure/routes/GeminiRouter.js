"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dependences_1 = require("../Dependences");
const routerGemini = (0, express_1.Router)();
routerGemini.post("/generate/:id", (req, res) => Dependences_1.generateActivityController.run(req, res));
exports.default = routerGemini;
