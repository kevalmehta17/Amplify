import express from 'express';
import authRoute from "./routes/auth.route.js";
import noteRoute from "./routes/note.route.js";
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/notes", noteRoute);


app.listen(PORT, () => {
    console.log(`Serve is running on port ${PORT}`);
    connectDB();
})