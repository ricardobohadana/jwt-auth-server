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
const hashPassword_1 = __importDefault(require("../passwordHash/hashPassword"));
// if prisma does not auto pick up types
// ctrl + shift + p >> typescrit restart
function signUpController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        // check if username and password were provided
        if (username == undefined || password == undefined) {
            return res.sendStatus(400);
        }
        // check if username and password are not empty
        if (username === "" || password === "") {
            return res
                .status(400)
                .json({ error: "username and password must not be empty" });
        }
        // check if username is already registered
        const alreadyExists = (yield server_1.prisma.user.count({ where: { username: username } })) > 0
            ? true
            : false;
        if (alreadyExists) {
            return res.status(400).json({ error: "Username already exists" });
        }
        //   create user
        const user = {
            username: username,
            password: (0, hashPassword_1.default)(password),
        };
        //   send user to db
        const dbUser = yield server_1.prisma.user.create({
            data: user,
        });
        // create token
        const accessToken = jsonwebtoken_1.default.sign(user, env.ACCESS_SECRET_TOKEN, {
            expiresIn: server_1.authTimeout,
        });
        // create refreshToken
        const refreshToken = jsonwebtoken_1.default.sign({ username: username, password: password }, env.REFRESH_SECRET_TOKEN);
        // send refreshToken to db
        const rToken = yield server_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: dbUser.id,
            },
        });
        // return to client
        res.json(Object.assign(Object.assign({}, user), { accessToken: accessToken, refreshToken: refreshToken }));
    });
}
exports.default = signUpController;
