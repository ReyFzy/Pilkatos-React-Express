import express from "express";

import * as userController from '../controllers/userController.js';
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../config/multerConfig.js";

const router  = express.Router();

router.get('/users', verifyToken, userController.getUsers);
router.get('/users/count', verifyToken, userController.countUsers);
router.get('/users/:NIS', verifyToken, userController.getUserById);
router.delete('/users/:NIS', verifyToken, userController.deleteUser);
router.patch('/users/:NIS', verifyToken, upload.single('profilePic'), userController.updateUser);

export const userRoutes = router;