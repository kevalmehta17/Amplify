import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from "../controller/note.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getNotes);

router.post("/", createNote);

router.get("/:id", getNoteById);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);



export default router;