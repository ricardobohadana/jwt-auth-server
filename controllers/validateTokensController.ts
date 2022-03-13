import { Request, Response } from "express";
import { verify, sign } from "jsonwebtoken";
import { env } from "process";
import { authTimeout, prisma } from "../server";
import getAccessTokenFromHeader from "../tokens/getAccessTokenFromHeader";
import getRefreshTokenFromHeader from "../tokens/getRefreshTokenFromHeader";

async function validateTokensController(request: Request, response: Response) {
    // get tokens from headers
    const accessToken = getAccessTokenFromHeader(request);
    const refreshToken = getRefreshTokenFromHeader(request);

    // check if accessToken and refreshToken exists
    if (!accessToken || !refreshToken)
        return response.status(400).json({
            error: "No access or refresh Token inside request headers",
        });

    // check if refreshToken exists
    const dbToken = await prisma.refreshToken.findFirst({
        where: {
            token: refreshToken,
        },
    });

    // in case refreshToken is invalid
    if (!dbToken)
        return response.status(401).json({ error: "Refresh token is invalid" });

    // if refreshToken is valid, check accessToken
    verify(
        accessToken,
        env.ACCESS_SECRET_TOKEN as string,
        async (err, decoded) => {
            // if accessToken is invalid, generate new accessToken
            if (err) {
                const dbUser = await prisma.user.findUnique({
                    where: {
                        id: dbToken.userId,
                    },
                });
                if (!dbUser) return response.sendStatus(500);

                const user = {
                    username: dbUser.username,
                    password: dbUser.password,
                };

                const newAccessToken = sign(
                    user,
                    env.ACCESS_SECRET_TOKEN as string,
                    { expiresIn: authTimeout }
                );

                return response
                    .status(200)
                    .json({ accessToken: newAccessToken });
            } else {
                // if accessToken is valid, return accessToken
                return response.status(200).json({ accessToken: accessToken });
            }
        }
    );
}

export default validateTokensController;
