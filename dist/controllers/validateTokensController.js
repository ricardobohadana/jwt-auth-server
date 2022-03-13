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
const jsonwebtoken_1 = require("jsonwebtoken");
const process_1 = require("process");
const server_1 = require("../server");
const getAccessTokenFromHeader_1 = __importDefault(require("../tokens/getAccessTokenFromHeader"));
const getRefreshTokenFromHeader_1 = __importDefault(require("../tokens/getRefreshTokenFromHeader"));
function validateTokensController(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get tokens from headers
        const accessToken = (0, getAccessTokenFromHeader_1.default)(request);
        const refreshToken = (0, getRefreshTokenFromHeader_1.default)(request);
        // check if accessToken and refreshToken exists
        if (!accessToken || !refreshToken)
            return response.status(400).json({
                error: "No access or refresh Token inside request headers",
            });
        // check if refreshToken exists
        const dbToken = yield server_1.prisma.refreshToken.findFirst({
            where: {
                token: refreshToken,
            },
        });
        // in case refreshToken is invalid
        if (!dbToken)
            return response.status(401).json({ error: "Refresh token is invalid" });
        // if refreshToken is valid, check accessToken
        (0, jsonwebtoken_1.verify)(accessToken, process_1.env.ACCESS_SECRET_TOKEN, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
            // if accessToken is invalid, generate new accessToken
            if (err) {
                const dbUser = yield server_1.prisma.user.findUnique({
                    where: {
                        id: dbToken.userId,
                    },
                });
                if (!dbUser)
                    return response.sendStatus(500);
                const user = {
                    username: dbUser.username,
                    password: dbUser.password,
                };
                const newAccessToken = (0, jsonwebtoken_1.sign)(user, process_1.env.ACCESS_SECRET_TOKEN, { expiresIn: server_1.authTimeout });
                return response
                    .status(200)
                    .json({ accessToken: newAccessToken });
            }
            else {
                // if accessToken is valid, return accessToken
                return response.status(200).json({ accessToken: accessToken });
            }
        }));
    });
}
exports.default = validateTokensController;
