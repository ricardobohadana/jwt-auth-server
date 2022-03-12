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
const getRefreshTokenFromHeader_1 = __importDefault(require("../tokens/getRefreshTokenFromHeader"));
function deleteUserController(request, response) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = (_a = request.body) !== null && _a !== void 0 ? _a : "";
        if (!id || id === "")
            return response.sendStatus(401);
        // verificar se o id existe
        const dbUser = yield server_1.prisma.user.findFirst({
            where: {
                id: id,
            },
        });
        const refreshToken = (0, getRefreshTokenFromHeader_1.default)(request);
        const RTObject = yield server_1.prisma.refreshToken.findFirst({
            where: {
                token: refreshToken,
            },
        });
        const requestUser = yield server_1.prisma.user.findFirst({
            where: {
                id: RTObject === null || RTObject === void 0 ? void 0 : RTObject.userId,
            },
        });
        if (dbUser === undefined || !dbUser)
            return response.status(400).json({ error: "wrong user id" });
        if (dbUser.id === (requestUser === null || requestUser === void 0 ? void 0 : requestUser.id))
            return response.status(401).json({
                error: "Voce não pode excluir o próprio usuário desta forma",
            });
        yield server_1.prisma.refreshToken.deleteMany({
            where: {
                userId: dbUser.id,
            },
        });
        yield server_1.prisma.user.delete({
            where: {
                id: dbUser.id,
            },
        });
        response.sendStatus(200);
    });
}
exports.default = deleteUserController;
