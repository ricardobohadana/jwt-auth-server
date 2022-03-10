import { authTimeout, prisma } from "../server";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "process";
import getAccessTokenFromHeader from "./getAccessTokenFromHeader";
import getRefreshTokenFromHeader from "./getRefreshTokenFromHeader";

async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const accessToken = getAccessTokenFromHeader(req);
    console.log("authenticateToken - accessToken: ", accessToken);

    // verifica a presença do accessToken
    if (!accessToken || accessToken === "")
        return res.status(401).json({ error: "Access token não encontrado" });

    // verifica a legitimidade do accessToken
    jwt.verify(
        accessToken,
        env.ACCESS_SECRET_TOKEN as string,
        async (err, user) => {
            // se o accessToken expirou ou não é legítimo
            if (err) {
                const refreshToken = getRefreshTokenFromHeader(req);

                // verifica a presença do refreshToken
                if (!refreshToken)
                    return res
                        .status(401)
                        .json({ error: "Refresh token não informado" });

                // se o refreshToken foi informado, verifica a existência no banco
                console.log("authenticateToken - refreshToken: ", refreshToken);
                const rToken =
                    (await prisma.refreshToken.findUnique({
                        where: {
                            token: refreshToken,
                        },
                    })) ?? undefined;

                // se não existir no banco, refreshToken errado
                if (rToken === undefined)
                    return res
                        .status(401)
                        .json({ error: "Wrong refresh token" });

                // se existe no banco de dados, pega o usuário correspondente
                const dbUser =
                    (await prisma.user.findUnique({
                        where: {
                            id: rToken.userId,
                        },
                    })) ?? undefined;

                // se o usuário existir
                if (dbUser !== undefined) {
                    // cria um novo accessToken
                    const newAccessToken = jwt.sign(
                        {
                            username: dbUser.username,
                            password: dbUser.password,
                        },
                        env.ACCESS_SECRET_TOKEN as string,
                        { expiresIn: authTimeout }
                    );
                    // coloca no body do request tanto o novo accessToken quanto o refreshToken recebido
                    req.body.user = {
                        username: dbUser.username,
                        password: dbUser.password,
                        refreshToken: rToken.token,
                        accessToken: newAccessToken,
                    };
                    next();
                }
            } else {
                // se o accessToken for válido, checa o refreshToken
                const refreshToken = getRefreshTokenFromHeader(req);
                console.log("authenticateToken - refreshToken: ", refreshToken);

                // verifica a presença do refreshToken
                if (!refreshToken)
                    return res
                        .status(401)
                        .json({ error: "Refresh token não informado" });

                // se o refreshToken foi informado, verifica a existência no banco
                const rToken =
                    (await prisma.refreshToken.findUnique({
                        where: {
                            token: refreshToken,
                        },
                    })) ?? undefined;

                // se não existir no banco, refreshToken errado
                if (rToken === undefined)
                    return res
                        .status(401)
                        .json({ error: "Wrong refresh token" });

                // caso exista, continua
                req.body.user = user;
                next();
            }
        }
    );
}

export default authenticateToken;
