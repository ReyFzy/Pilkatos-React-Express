import {prisma} from "../lib/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany({
            select: {
                NIS: true,
                nama: true,
                kelas: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
}

export async function Register(req, res) {
    const { NIS, nama, kelas, password, confPassword } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password sama Confirm Password engga cocok" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { NIS } });
        if (existingUser) {
            return res.status(400).json({ msg: "NIS-nya udah terdaftar, coba Login" });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await prisma.user.create({
            data: {
                NIS,
                nama,
                kelas,
                password: hashPassword,
                role: "USER",
                createAt: new Date(),
                updateAt: new Date()
            }
        });

        res.json({ msg: "Registrasi Berhasil" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan di server" });
    }
}


export async function Login(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { NIS: req.body.NIS }
        });
        if (!user) return res.status(404).json({ msg: "User-nya belum terdaftar, coba Register" });
        
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ msg: "Passwordnya salah!" });
        
        const accessToken = jwt.sign({ NIS: user.NIS, nama: user.nama, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        
        const refreshToken = jwt.sign({ NIS: user.NIS, nama: user.nama, role: user.role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        
        await prisma.user.update({
            where: { NIS: user.NIS },
            data: { refresh_token: refreshToken },
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
}

export async function Logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    
    try {
        const user = await prisma.user.findFirst({
            where: { refresh_token: refreshToken }
        });
        if (!user || !user.refresh_token) return res.sendStatus(204);
        
        await prisma.user.update({
            where: { NIS: user.NIS },
            data: { refresh_token: null }
        });
        
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
}
