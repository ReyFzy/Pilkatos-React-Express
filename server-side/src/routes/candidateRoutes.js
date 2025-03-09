import express from "express";

import { getCandidates, updateCandidate, deleteCandidate, createCandidate, countCandidate } from "../controllers/candidateController.js"; 
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/candidates", verifyToken, getCandidates);
router.get("/candidates/count", verifyToken, countCandidate);
router.post("/candidates", verifyToken, (req, res, next) => {
    upload.single("banner")(req, res, (err) => {
        if (err) return res.status(400).json({ msg: "Upload gagal" });
        next();
    });
}, createCandidate);
router.patch("/candidates/:id", verifyToken, upload.single("banner"), updateCandidate);
router.delete("/candidates/:id", verifyToken, deleteCandidate);


export const candidateRoutes = router;
