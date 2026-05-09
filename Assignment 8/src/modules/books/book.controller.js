import * as bookService from "./book.service.js";
import { Router } from "express";
const router = Router();

// Test route
router.get("/test", (req, res) => {
    res.json({ message: "Router is working!" });
});

// 3. Create capped logs collection
router.post("/collection/logs/capped", bookService.createCappedLogsCollection);

// 4. Create index on books collection
router.post("/collection/books/index", bookService.createTitleIndex);

// 2. Create author (implicit collection)
router.post("/authors", bookService.createAuthor);

// 7. Insert log into logs collection
router.post("/logs", bookService.createLog);

// 6. Insert multiple documents into books
router.post("/batch", bookService.createBooksInBatch);

// 9. Find book by title (query parameter)
router.get("/title", bookService.findBookByTitle);

// 10. Find books by year range
router.get("/year", bookService.findBooksByYearRange);

// 13. Find books with integer year
router.get("/year-integer", bookService.findBooksWithIntegerYear);

// 11. Find books by genre
router.get("/genre", bookService.findBooksByGenre);

// 12. Skip, limit, and sort
router.get("/skip-limit", bookService.findBooksWithSkipLimit);

// 14. Find books excluding genres
router.get("/exclude-genres", bookService.findBooksExcludingGenres);

// 15. Delete books before year
router.delete("/before-year", bookService.deleteBooksBeforeYear);

// 5. Insert one document into books
router.post("/", bookService.createBook);

// 8. Update book by title (this should be last among similar routes)
router.patch("/:title", bookService.updateBookByTitle);

// Aggregation routes
router.get("/aggregate1", bookService.aggregate1);
router.get("/aggregate2", bookService.aggregate2);
router.get("/aggregate3", bookService.aggregate3);
router.get("/aggregate4", bookService.aggregate4);

export default router;