import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
require("dotenv").config();
import signUpController from "./controllers/signUpController";
import signInController from "./controllers/signInController";
import { PrismaClient } from "@prisma/client";
import signOutController from "./controllers/signOutController";
import getAllUsers from "./controllers/getAllUsers";
import cookieParser from "cookie-parser";
import authenticateToken from "./tokens/authenticateToken";
import deleteUserController from "./controllers/deleteUserController";
import updateUserController from "./controllers/updateUserController";
const { env } = process;
export const prisma = new PrismaClient();
const app = express();
export const authTimeout = "10m";

app.use(express.json());
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
app.use(cors());
// register
app.post("/signup", signUpController);

// login
app.post("/signin", signInController);

// get users (must authenticate)
app.use("/users", authenticateToken);
app.get("/users", getAllUsers);

// logout
app.use("/logout", authenticateToken);
app.get("/logout", signOutController);

// delete user
app.use("/delete", authenticateToken);
app.post("/delete", deleteUserController);

// update user
app.use("/update", authenticateToken);
app.post("/update", updateUserController);

// listen port
app.listen(env.PORT || 3001, () => console.log("API ONLINE"));
