import { Router } from "express";
import {
	createNote,
	deleteAllLoggedInUserNotes,
	deleteNoteById,
	getAggregatedNotes,
	getNoteByContent,
	getNoteById,
	getNotesWithUserInfo,
	getPaginatedSortedNotes,
	replaceNoteById,
	updateAllNotesTitle,
	updateNoteById,
} from "./notes.service.js";

const router = Router();

router.post("/", createNote);
router.patch("/all", updateAllNotesTitle);
router.delete("/", deleteAllLoggedInUserNotes);
router.get("/paginate-sort", getPaginatedSortedNotes);
router.get("/aggregate", getAggregatedNotes);
router.get("/note-by-content", getNoteByContent);
router.get("/note-with-u", getNotesWithUserInfo);
router.put("/replace/:noteId", replaceNoteById);
router.patch("/:noteId", updateNoteById);
router.delete("/:noteId", deleteNoteById);
router.get("/:id", getNoteById);


export default router;