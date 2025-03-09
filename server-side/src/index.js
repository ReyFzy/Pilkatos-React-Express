import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {userRoutes} from "./routes/userRoutes.js";
import {authRoutes} from "./routes/authRoutes.js";
import { candidateRoutes } from './routes/candidateRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use("/api/v1", authRoutes)
app.use("/api/v1", userRoutes)
app.use("/api/v1", candidateRoutes)

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));