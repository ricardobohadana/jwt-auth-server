import jwt from "jsonwebtoken";
import { prisma } from "../server";
require("dotenv").config();
const { env } = process;

async function updateAccessToken(refreshToken: string) {
    const refreshTokenObject = await prisma.refreshToken.findFirst({
        where: { token: refreshToken },
    });

    const userId = refreshTokenObject?.userId;

    const dbUser = await prisma.user.findFirst({ where: { id: userId } });

    return jwt.sign(
        { username: dbUser?.username, password: dbUser?.password },
        env.ACCESS_SECRET_KEY as string,
        { expiresIn: "30s" }
    );
}

export default updateAccessToken;
