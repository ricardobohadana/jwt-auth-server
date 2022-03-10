"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTimeout = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const signUpController_1 = __importDefault(require("./controllers/signUpController"));
const signInController_1 = __importDefault(require("./controllers/signInController"));
const client_1 = require("@prisma/client");
const signOutController_1 = __importDefault(require("./controllers/signOutController"));
const getAllUsers_1 = __importDefault(require("./controllers/getAllUsers"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authenticateToken_1 = __importDefault(require("./tokens/authenticateToken"));
const { env } = process;
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
exports.authTimeout = "10m";
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
// register
app.post("/signup", signUpController_1.default);
// login
app.post("/signin", signInController_1.default);
// get users (must authenticate)
app.use("/users", authenticateToken_1.default);
app.get("/users", getAllUsers_1.default);
// logout
app.use("/logout", authenticateToken_1.default);
app.get("/logout", signOutController_1.default);
app.listen(3001);
