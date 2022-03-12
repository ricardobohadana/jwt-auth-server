import { Request, Response } from "express";
import { prisma } from "../server";
import getRefreshTokenFromHeader from "../tokens/getRefreshTokenFromHeader";

async function deleteUserController(request: Request, response: Response) {
    const { id } = request.body ?? "";

    if (!id || id === "") return response.sendStatus(401);

    // verificar se o id existe
    const dbUser = await prisma.user.findFirst({
        where: {
            id: id,
        },
    });

    const refreshToken = getRefreshTokenFromHeader(request);
    const RTObject = await prisma.refreshToken.findFirst({
        where: {
            token: refreshToken,
        },
    });

    const requestUser = await prisma.user.findFirst({
        where: {
            id: RTObject?.userId,
        },
    });

    if (dbUser === undefined || !dbUser)
        return response.status(400).json({ error: "wrong user id" });

    if (dbUser.id === requestUser?.id)
        return response.status(401).json({
            error: "Voce não pode excluir o próprio usuário desta forma",
        });

    await prisma.refreshToken.deleteMany({
        where: {
            userId: dbUser.id,
        },
    });
    await prisma.user.delete({
        where: {
            id: dbUser.id,
        },
    });

    response.sendStatus(200);
}

export default deleteUserController;
