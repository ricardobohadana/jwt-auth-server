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
const authenticateToken_1 = __importDefault(require("./tokens/authenticateToken"));
const { env } = process;
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
exports.authTimeout = "10m";
app.use(express_1.default.json());
// app.use(cookieParser());
// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader(
//         "Access-Control-Allow-Origin",
//         "https://jwt-auth-login-page.vercel.app"
//     );
//     // Request methods you wish to allow
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );
//     // Request headers you wish to allow
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "X-Requested-With,content-type"
//     );
//     // Pass to next layer of middleware
//     next();
// });
// app.use(
//     cors({
//         origin: "https://jwt-auth-login-page.vercel.app",
//     })
// );
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
app.listen(env.PORT || 3001, () => console.log("API ONLINE"));
