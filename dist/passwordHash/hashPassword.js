"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const saltRounds = 10;
const salt = (0, bcrypt_1.genSaltSync)(saltRounds);
const hashPassword = (password) => {
    const hash = (0, bcrypt_1.hashSync)(password, salt);
    return hash;
};
exports.default = hashPassword;
