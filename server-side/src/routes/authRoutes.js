import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/authController.js";
import { refreshToken } from "../controllers/refreshToken.js";
 
const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
 
export const authRoutes = router;