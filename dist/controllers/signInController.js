"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const { env } = process;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const bcrypt_1 = require("bcrypt");
function signInController(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // check if username and password were provided
        const hasUsername = req.body.hasOwnProperty("username");
        const hasPassword = req.body.hasOwnProperty("password");
        if (!hasPassword || !hasUsername)
            return res
                .status(400)
                .json({ error: "username or password is missing" });
        const { username, password } = req.body;
        // check if user with 'username' exists
        var dbUser = (_a = (yield server_1.prisma.user.findUnique({
            where: {
                username: username,
            },
        }))) !== null && _a !== void 0 ? _a : { username: "", password: "", id: "", refreshToken: "" };
        if (dbUser.password === "")
            return res.status(400).json({ error: "username is not registered" });
        const passwordIsMatch = (0, bcrypt_1.compareSync)(password, dbUser.password);
        if (!passwordIsMatch) {
            return res.status(400).json({ error: "password is incorrect" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ username: dbUser.username, password: dbUser.password }, env.ACCESS_SECRET_TOKEN, { expiresIn: server_1.authTimeout });
        const refreshToken = jsonwebtoken_1.default.sign({ username: dbUser.username, password: dbUser.password }, env.REFRESH_SECRET_TOKEN);
        yield server_1.prisma.refreshToken.deleteMany({
            where: {
                userId: dbUser.id,
            },
        });
        const rToken = yield server_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: dbUser.id,
            },
        });
        return res.status(200).json({
            username: dbUser.username,
            password: dbUser.password,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    });
}
exports.default = signInController;
