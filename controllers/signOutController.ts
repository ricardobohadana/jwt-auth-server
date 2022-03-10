import express, { Request, Response } from "express";
import { prisma } from "../server";
import getAccessTokenFromHeader from "../tokens/getAccessTokenFromHeader";
import getRefreshTokenFromHeader from "../tokens/getRefreshTokenFromHeader";

async function signOutController(req: Request, res: Response) {
    const refreshToken = getRefreshTokenFromHeader(req);
    console.log("signOutController - refreshToken: ", refreshToken);
    await prisma.refreshToken.deleteMany({
        where: {
            token: refreshToken,
        },
    });

    res.sendStatus(200);
}

export default signOutController;
