import { prisma } from "../server";
import { Request, Response } from "express";

async function getAllUsers(req: Request, res: Response) {
    const data = await prisma.user.findMany();

    return res.status(200).json({ ...req.body, data: data });
}

export default getAllUsers;
