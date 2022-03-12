import { Request, Response } from "express";
import hashPassword from "../passwordHash/hashPassword";
import { prisma } from "../server";

async function updateUserController(request: Request, response: Response) {
    const { userId, username, password } = request.body ?? "";

    if (!userId || userId === "") return response.sendStatus(401);
    if (!username || username === "") return response.sendStatus(401);

    if (password) {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                username: username,
                password: hashPassword(password),
            },
        });
    } else {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                username: username,
            },
        });
    }

    response.sendStatus(200);
}

export default updateUserController;
