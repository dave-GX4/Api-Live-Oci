"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
class BcryptEncryptService {
    constructor() {
        this.SALT_ROUNDS = 10;
    }
    async hash(password) {
        return await (0, bcrypt_1.hash)(password, this.SALT_ROUNDS);
    }
    async compare(password, hash) {
        return await (0, bcrypt_1.compare)(password, hash);
    }
}
exports.default = BcryptEncryptService;
