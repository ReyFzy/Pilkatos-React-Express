import { prisma } from "../lib/prismaClient.js";

// CRUD Candidate
export async function getCandidates(req, res) {
    try {
        const candidates = await prisma.candidate.findMany({
            include: {
                Ketua: { include: { User: true } },
                Wakil: { include: { User: true } }
            }
        });

        const formattedData = candidates.map(candidate => ({
            id: candidate.id,
            banner: candidate.banner ? `http://localhost:5000${candidate.banner}` : null,
            tahun: candidate.tahun,
            visi: candidate.visi,
            misi: candidate.misi,
            program: candidate.program,
            ketua: candidate.Ketua ? {
                id: candidate.Ketua.id,
                userId: candidate.Ketua.userId,
                nama: candidate.Ketua.User.nama,
                kelas: candidate.Ketua.User.kelas
            } : null,
            wakil: candidate.Wakil ? {
                id: candidate.Wakil.id,
                userId: candidate.Wakil.userId,
                nama: candidate.Wakil.User.nama,
                kelas: candidate.Wakil.User.kelas
            } : null
        }));

        res.json(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}

export async function createCandidate(req, res) {
    const { tahun, visi, misi, userKetuaId, userWakilId, program } = req.body;
    const banner = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        let ketua = await prisma.ketua.findUnique({ where: { userId: userKetuaId } });
        if (!ketua) {
            ketua = await prisma.ketua.create({ data: { userId: userKetuaId } });
        }

        let wakil = await prisma.wakil.findUnique({ where: { userId: userWakilId } });
        if (!wakil) {
            wakil = await prisma.wakil.create({ data: { userId: userWakilId } });
        }

        const candidate = await prisma.candidate.create({
            data: {
                tahun,
                visi,
                misi,
                program,
                banner,
                createAt: new Date(),
                updateAt: new Date(),
                ketuaId: ketua.id,
                wakilId: wakil.id
            }
        });

        res.json({ msg: "Data berhasil dibuat", candidate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}

export async function updateCandidate(req, res) {
    const { id } = req.params;
    const { tahun, visi, misi, userKetuaId, userWakilId } = req.body;
    const banner = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const existingCandidate = await prisma.candidate.findUnique({ where: { id } });
        if (!existingCandidate) return res.status(404).json({ msg: "Candidate tidak ditemukan" });

        if (userKetuaId && userKetuaId !== existingCandidate.ketuaId) {
            let ketua = await prisma.ketua.findUnique({ where: { userId: userKetuaId } });
            if (!ketua) {
                ketua = await prisma.ketua.create({ data: { userId: userKetuaId } });
            }
            existingCandidate.ketuaId = ketua.id;
        }

        if (userWakilId && userWakilId !== existingCandidate.wakilId) {
            let wakil = await prisma.wakil.findUnique({ where: { userId: userWakilId } });
            if (!wakil) {
                wakil = await prisma.wakil.create({ data: { userId: userWakilId } });
            }
            existingCandidate.wakilId = wakil.id;
        }

        const updatedCandidate = await prisma.candidate.update({
            where: { id },
            data: {
                tahun,
                visi,
                misi,
                banner: banner || existingCandidate.banner,
                ketuaId: existingCandidate.ketuaId,
                wakilId: existingCandidate.wakilId,
                updateAt: new Date()
            }
        });

        res.json({ msg: "Candidate berhasil diperbarui", updatedCandidate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}

export async function deleteCandidate(req, res) {
    const { id } = req.params;
    try {
        const candidate = await prisma.candidate.findUnique({ where: { id } });
        if (!candidate) return res.status(404).json({ msg: "Candidate tidak ditemukan" });

        await prisma.candidate.delete({ where: { id } });

        const ketuaCount = await prisma.candidate.count({ where: { ketuaId: candidate.ketuaId } });
        const wakilCount = await prisma.candidate.count({ where: { wakilId: candidate.wakilId } });

        if (ketuaCount === 0) await prisma.ketua.delete({ where: { id: candidate.ketuaId } });
        if (wakilCount === 0) await prisma.wakil.delete({ where: { id: candidate.wakilId } });

        res.json({ msg: "Candidate berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
}

export async function countCandidate(req, res) {
    try {
        const count = await prisma.candidate.count();
        res.status(200).json({ totalCandidate: count });
    } catch (err) {
        console.error('Error counting candidates:', err);
        res.status(500).json({ error: 'Failed to count candidates' });
    } finally {
        prisma.$disconnect();
    }
}