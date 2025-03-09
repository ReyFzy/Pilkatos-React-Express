import {prisma} from "../lib/prismaClient.js";

export async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        if (users.length === 0) return res.status(404).json({msg: 'No users found'});
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Initial Server Error"});
    } finally {
        prisma.$disconnect();
    }
}

export async function getUserById(req, res) {
    try {
        const NIS  = req.params.NIS;
        const users = await prisma.user.findFirst({
            where: { NIS }
        });
        if (!users) return res.status(404).json({msg: 'No users found'});
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Initial Server Error"});
    } finally {
        prisma.$disconnect();
    }
}

export async function deleteUser(req, res) {
    try{
        const NIS = req.params.NIS;
        await prisma.user.delete({
            where: { NIS }
        });
        res.status(200).json({ msg: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Initial Server Error"});
    } finally {
        prisma.$disconnect();
    }
}

export async function updateUser(req, res) {
    try {
        const NIS = req.params.NIS;
        const userDTO = req.body;
        const user = await prisma.user.findFirst({ where: { NIS } });
        
        const profilePicUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : user.profilePic;
        
        if (!user) return res.status(404).json({ msg: "No users found" });

        const updatedData = {
            nama: userDTO.nama,
            kelas: userDTO.kelas,
            password: userDTO.password,
            role: userDTO.role,
            createAt: userDTO.createAt,
            updateAt: new Date(),
            refresh_token: userDTO.refresh_token,
            profilePic: profilePicUrl
        };

        const updated = await prisma.user.update({ data: updatedData, where: { NIS } });

        return res.status(200).json({ msg: "Account has been updated", updated });
    } catch (err) {
        console.error('Error update account:', err);
        return res.status(500).json({ error: 'Failed to update account' });
    } finally {
        prisma.$disconnect();
    }
}


export async function countUsers(req, res) {
    try {
        const count = await prisma.user.count();
        res.status(200).json({ totalUsers: count });
    } catch (err) {
        console.error('Error counting users:', err);
        res.status(500).json({ error: 'Failed to count users' });
    } finally {
        prisma.$disconnect();
    }
}