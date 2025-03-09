import { prisma } from "../lib/prismaClient.js";
import jwt from "jsonwebtoken";

export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        
        const user = await prisma.user.findFirst({
            where: { refresh_token: refreshToken }
        });
        if (!user || !user.refresh_token) return res.sendStatus(403);
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            
            const accessToken = jwt.sign({ NIS: user.NIS, nama: user.nama, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
}
