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
const server_1 = require("../server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const process_1 = require("process");
const getAccessTokenFromHeader_1 = __importDefault(require("./getAccessTokenFromHeader"));
const getRefreshTokenFromHeader_1 = __importDefault(require("./getRefreshTokenFromHeader"));
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = (0, getAccessTokenFromHeader_1.default)(req);
        console.log("authenticateToken - accessToken: ", accessToken);
        // verifica a presença do accessToken
        if (!accessToken || accessToken === "")
            return res.status(401).json({ error: "Access token não encontrado" });
        // verifica a legitimidade do accessToken
        jsonwebtoken_1.default.verify(accessToken, process_1.env.ACCESS_SECRET_TOKEN, (err, user) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // se o accessToken expirou ou não é legítimo
            if (err) {
                const refreshToken = (0, getRefreshTokenFromHeader_1.default)(req);
                // verifica a presença do refreshToken
                if (!refreshToken)
                    return res
                        .status(401)
                        .json({ error: "Refresh token não informado" });
                // se o refreshToken foi informado, verifica a existência no banco
                console.log("authenticateToken - refreshToken: ", refreshToken);
                const rToken = (_a = (yield server_1.prisma.refreshToken.findUnique({
                    where: {
                        token: refreshToken,
                    },
                }))) !== null && _a !== void 0 ? _a : undefined;
                // se não existir no banco, refreshToken errado
                if (rToken === undefined)
                    return res
                        .status(401)
                        .json({ error: "Wrong refresh token" });
                // se existe no banco de dados, pega o usuário correspondente
                const dbUser = (_b = (yield server_1.prisma.user.findUnique({
                    where: {
                        id: rToken.userId,
                    },
                }))) !== null && _b !== void 0 ? _b : undefined;
                // se o usuário existir
                if (dbUser !== undefined) {
                    // cria um novo accessToken
                    const newAccessToken = jsonwebtoken_1.default.sign({
                        username: dbUser.username,
                        password: dbUser.password,
                    }, process_1.env.ACCESS_SECRET_TOKEN, { expiresIn: server_1.authTimeout });
                    // coloca no body do request tanto o novo accessToken quanto o refreshToken recebido
                    req.body.user = {
                        username: dbUser.username,
                        password: dbUser.password,
                        refreshToken: rToken.token,
                        accessToken: newAccessToken,
                    };
                    next();
                }
            }
            else {
                // se o accessToken for válido, checa o refreshToken
                const refreshToken = (0, getRefreshTokenFromHeader_1.default)(req);
                console.log("authenticateToken - refreshToken: ", refreshToken);
                // verifica a presença do refreshToken
                if (!refreshToken)
                    return res
                        .status(401)
                        .json({ error: "Refresh token não informado" });
                // se o refreshToken foi informado, verifica a existência no banco
                const rToken = (_c = (yield server_1.prisma.refreshToken.findUnique({
                    where: {
                        token: refreshToken,
                    },
                }))) !== null && _c !== void 0 ? _c : undefined;
                // se não existir no banco, refreshToken errado
                if (rToken === undefined)
                    return res
                        .status(401)
                        .json({ error: "Wrong refresh token" });
                // caso exista, continua
                req.body.user = user;
                next();
            }
        }));
    });
}
exports.default = authenticateToken;
