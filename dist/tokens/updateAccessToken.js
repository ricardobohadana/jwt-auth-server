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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
require("dotenv").config();
const { env } = process;
function updateAccessToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshTokenObject = yield server_1.prisma.refreshToken.findFirst({
            where: { token: refreshToken },
        });
        const userId = refreshTokenObject === null || refreshTokenObject === void 0 ? void 0 : refreshTokenObject.userId;
        const dbUser = yield server_1.prisma.user.findFirst({ where: { id: userId } });
        return jsonwebtoken_1.default.sign({ username: dbUser === null || dbUser === void 0 ? void 0 : dbUser.username, password: dbUser === null || dbUser === void 0 ? void 0 : dbUser.password }, env.ACCESS_SECRET_KEY, { expiresIn: "30s" });
    });
}
exports.default = updateAccessToken;
