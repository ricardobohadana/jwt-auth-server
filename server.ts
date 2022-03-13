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
app.use(cookieParser());

// cors options
const allowedDomains = [
    "https://jwt-auth-login-page.vercel.app",
    "http://localhost:3000",
];
app.use(
    cors({
        origin: (origin, callback) => {
            if (origin === undefined) {
                callback(new Error("Not allowed origin by CORS"));
            } else if (allowedDomains.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed origin by CORS"));
            }
        },
        optionsSuccessStatus: 200,
    })
);

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
