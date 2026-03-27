"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependence_1 = require("../dependence");
const routerAuth = (0, express_1.Router)();
routerAuth.post("/singin", (req, res) => dependence_1.singInController.run(req, res));
routerAuth.post("/singup", (req, res) => dependence_1.singUpController.run(req, res));
exports.default = routerAuth;
