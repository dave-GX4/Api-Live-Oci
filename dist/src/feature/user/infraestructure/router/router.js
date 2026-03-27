"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dependences_1 = require("../Dependences");
const routerUser = (0, express_1.Router)();
routerUser.get("/get/:id", (req, res) => Dependences_1.getByIdController.run(req, res));
routerUser.patch("/update/:id", (req, res) => Dependences_1.updateController.run(req, res));
routerUser.delete("/delete/:id", (req, res) => Dependences_1.deleteController.run(req, res));
exports.default = routerUser;
