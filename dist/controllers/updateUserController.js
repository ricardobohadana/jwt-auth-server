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
const hashPassword_1 = __importDefault(require("../passwordHash/hashPassword"));
const server_1 = require("../server");
function updateUserController(request, response) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, username, password } = (_a = request.body) !== null && _a !== void 0 ? _a : "";
        if (!userId || userId === "")
            return response.sendStatus(401);
        if (!username || username === "")
            return response.sendStatus(401);
        if (password) {
            yield server_1.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    username: username,
                    password: (0, hashPassword_1.default)(password),
                },
            });
        }
        else {
            yield server_1.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    username: username,
                },
            });
        }
        response.sendStatus(200);
    });
}
exports.default = updateUserController;
