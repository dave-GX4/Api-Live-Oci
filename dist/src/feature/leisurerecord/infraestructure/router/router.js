"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dependences_1 = require("../Dependences");
const routerLeisureRecords = (0, express_1.Router)();
routerLeisureRecords.get("/allLeisureRecords/:id", (req, res) => Dependences_1.getAllController.run(req, res));
routerLeisureRecords.delete("/deleteLeisureRecord/:id", (req, res) => Dependences_1.deleteController.run(req, res));
routerLeisureRecords.patch("/update/:id", (req, res) => Dependences_1.updateController.run(req, res));
exports.default = routerLeisureRecords;
