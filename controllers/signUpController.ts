import { Request, Response } from "express";
require("dotenv").config();
const { env } = process;
import jwt from "jsonwebtoken";
import { authTimeout, prisma } from "../server";
import hashPassword from "../passwordHash/hashPassword";

// if prisma does not auto pick up types
// ctrl + shift + p >> typescrit restart
async function signUpController(req: Request, res: Response) {
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
    const alreadyExists =
        (await prisma.user.count({ where: { username: username } })) > 0
            ? true
            : false;

    if (alreadyExists) {
        return res.status(400).json({ error: "Username already exists" });
    }

    //   create user
    const user = {
        username: username,
        password: hashPassword(password),
    };

    //   send user to db
    const dbUser = await prisma.user.create({
        data: user,
    });

    // create token
    const accessToken = jwt.sign(user, env.ACCESS_SECRET_TOKEN as string, {
        expiresIn: authTimeout,
    });

    // create refreshToken
    const refreshToken = jwt.sign(
        { username: username, password: password },
        env.REFRESH_SECRET_TOKEN as string
    );

    // send refreshToken to db
    const rToken = await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: dbUser.id,
        },
    });

    // return to client
    res.json({
        ...user,
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
}

export default signUpController;
