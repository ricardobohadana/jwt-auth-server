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
const { env } = process;
export const prisma = new PrismaClient();
const app = express();
export const authTimeout = "10m";

app.use(express.json());
app.use(cookieParser());
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
app.listen(3001);
