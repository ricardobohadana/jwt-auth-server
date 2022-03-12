import { Request, Response } from "express";
require("dotenv").config();
const { env } = process;
import jwt from "jsonwebtoken";
import { authTimeout, prisma } from "../server";
import { compareSync } from "bcrypt";
import { Prisma, RefreshToken } from "@prisma/client";

async function signInController(req: Request, res: Response) {
    // check if username and password were provided
    const hasUsername = req.body.hasOwnProperty("username");
    const hasPassword = req.body.hasOwnProperty("password");

    if (!hasPassword || !hasUsername)
        return res
            .status(400)
            .json({ error: "username or password is missing" });

    const { username, password } = req.body;

    // check if user with 'username' exists
    var dbUser = (await prisma.user.findFirst({
        where: {
            username: username,
        },
    })) ?? { username: "", password: "", id: "", refreshToken: "" };
    if (dbUser.password === "")
        return res.status(400).json({ error: "username is not registered" });

    const passwordIsMatch = compareSync(password, dbUser.password);

    if (!passwordIsMatch) {
        return res.status(400).json({ error: "password is incorrect" });
    }

    const accessToken = jwt.sign(
        { username: dbUser.username, password: dbUser.password },
        env.ACCESS_SECRET_TOKEN as string,
        { expiresIn: authTimeout }
    );
    const refreshToken = jwt.sign(
        { username: dbUser.username, password: dbUser.password },
        env.REFRESH_SECRET_TOKEN as string
    );

    await prisma.refreshToken.deleteMany({
        where: {
            userId: dbUser.id,
        },
    });

    const rToken = await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: dbUser.id,
        },
    });
    return res.status(200).json({
        username: dbUser.username,
        password: dbUser.password,
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
}

export default signInController;
