import { db } from "../../DB/models/connection.js";

// Helper to get books collection
const getBooksCollection = () => db.collection("books");

// 5. Insert one document into books
export const createBook = async (req, res) => { 
    try {
        console.log("Request body:", req.body);
        
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is empty or invalid" });
        }
        
        const book = await getBooksCollection().insertOne(req.body);
        res.status(201).json({ message: "Book created successfully", bookId: book.insertedId });
    } catch (error) {
        console.error("Error creating book:", error);
        
        // Handle validation errors
        if (error.code === 121) {
            return res.status(400).json({ 
                message: "Validation error: title field is required and must be a non-empty string",
                error: error.message 
            });
        }
        
        res.status(500).json({ message: "Internal server error" });
    }   
};

// 6. Insert multiple documents into books
export const createBooksInBatch = async (req, res) => {
    try {
        const books = req.body;
        if (!Array.isArray(books) || books.length < 3) {
            return res.status(400).json({ message: "Please provide at least 3 books in an array" });
        }
        
        const result = await getBooksCollection().insertMany(books);
        res.status(201).json({ 
            message: "Books created successfully", 
            count: result.insertedCount,
            insertedIds: result.insertedIds 
        });
    } catch (error) {
        console.error("Error creating books:", error);
        
        if (error.code === 121) {
            return res.status(400).json({ 
                message: "Validation error: all books must have a non-empty title field",
                error: error.message 
            });
        }
        
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2. Create implicit collection by inserting data into "authors"
export const createAuthor = async (req, res) => {
    try {
        const authorsCollection = db.collection("authors");
        const author = await authorsCollection.insertOne(req.body);
        res.status(201).json({ 
            message: "Author created successfully (implicit collection created)", 
            authorId: author.insertedId 
        });
    } catch (error) {
        console.error("Error creating author:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 3. Create capped collection "logs"
export const createCappedLogsCollection = async (req, res) => {
    try {
        const collections = await db.listCollections({ name: "logs" }).toArray();
        
        if (collections.length > 0) {
            await db.collection("logs").drop();
        }
        
        await db.createCollection("logs", {
            capped: true,
            size: 1048576, // 1MB in bytes
            max: 1000 // Optional: max number of documents
        });
        
        res.status(201).json({ message: "Capped collection 'logs' created with size limit of 1MB" });
    } catch (error) {
        console.error("Error creating capped collection:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 4. Create index on books collection for title field
export const createTitleIndex = async (req, res) => {
    try {
        const result = await getBooksCollection().createIndex({ title: 1 });
        res.status(201).json({ message: "Index created on title field", indexName: result });
    } catch (error) {
        console.error("Error creating index:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 7. Insert log into logs collection
export const createLog = async (req, res) => {
    try {
        const logsCollection = db.collection("logs");
        const log = await logsCollection.insertOne({
            ...req.body,
            timestamp: new Date()
        });
        res.status(201).json({ message: "Log created successfully", logId: log.insertedId });
    } catch (error) {
        console.error("Error creating log:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 8. Update book with specific title
export const updateBookByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        const updates = req.body;
        
        const result = await getBooksCollection().updateOne(
            { title: title },
            { $set: updates }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Book with title "${title}" not found` });
        }
        
        res.status(200).json({ 
            message: "Book updated successfully", 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 9. Find book by title
export const findBookByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        
        if (!title) {
            return res.status(400).json({ message: "Title query parameter is required" });
        }
        
        const book = await getBooksCollection().findOne({ title: title });
        
        if (!book) {
            return res.status(404).json({ message: `Book with title "${title}" not found` });
        }
        
        res.status(200).json({ book });
    } catch (error) {
        console.error("Error finding book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 10. Find books by year range
export const findBooksByYearRange = async (req, res) => {
    try {
        const { from, to } = req.query;
        
        if (!from || !to) {
            return res.status(400).json({ message: "Both 'from' and 'to' query parameters are required" });
        }
        
        const books = await getBooksCollection().find({
            year: { $gte: parseInt(from), $lte: parseInt(to) }
        }).toArray();
        
        res.status(200).json({ count: books.length, books });
    } catch (error) {
        console.error("Error finding books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 11. Find books by genre
export const findBooksByGenre = async (req, res) => {
    try {
        const { genre } = req.query;
        
        if (!genre) {
            return res.status(400).json({ message: "Genre query parameter is required" });
        }
        
        const books = await getBooksCollection().find({
            genres: genre
        }).toArray();
        
        res.status(200).json({ count: books.length, books });
    } catch (error) {
        console.error("Error finding books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 12. Skip, limit, and sort books
export const findBooksWithSkipLimit = async (req, res) => {
    try {
        const books = await getBooksCollection().find({})
            .skip(2)
            .limit(3)
            .sort({ year: -1 })
            .toArray();
        
        res.status(200).json({ count: books.length, books });
    } catch (error) {
        console.error("Error finding books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 13. Find books where year is integer
export const findBooksWithIntegerYear = async (req, res) => {
    try {
        const books = await getBooksCollection().find({
            year: { $type: "int" }
        }).toArray();
        
        res.status(200).json({ count: books.length, books });
    } catch (error) {
        console.error("Error finding books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 14. Find books excluding specific genres
export const findBooksExcludingGenres = async (req, res) => {
    try {
        const books = await getBooksCollection().find({
            genres: { $nin: ["Horror", "Science Fiction"] }
        }).toArray();
        
        res.status(200).json({ count: books.length, books });
    } catch (error) {
        console.error("Error finding books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 15. Delete books before a specific year
export const deleteBooksBeforeYear = async (req, res) => {
    try {
        const { year } = req.query;
        
        if (!year) {
            return res.status(400).json({ message: "Year query parameter is required" });
        }
        
        const result = await getBooksCollection().deleteMany({
            year: { $lt: parseInt(year) }
        });
        
        res.status(200).json({ 
            message: `Deleted ${result.deletedCount} books published before ${year}`,
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        console.error("Error deleting books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Aggregation 1: Filter books published after 2000 and sort by year descending
export const aggregate1 = async (req, res) => {
    try {
        const books = await getBooksCollection().aggregate([
            { $match: { year: { $gt: 2000 } } },
            { $sort: { year: -1 } }
        ]).toArray();
        
        res.status(200).json({ 
            message: "Books published after 2000, sorted by year descending",
            count: books.length, 
            books 
        });
    } catch (error) {
        console.error("Error in aggregate1:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Aggregation 2: Find books after 2000 with only title, author, and year fields
export const aggregate2 = async (req, res) => {
    try {
        const books = await getBooksCollection().aggregate([
            { $match: { year: { $gt: 2000 } } },
            { $project: { _id: 0, title: 1, author: 1, year: 1 } }
        ]).toArray();
        
        res.status(200).json({ 
            message: "Books published after 2000 with selected fields",
            count: books.length, 
            books 
        });
    } catch (error) {
        console.error("Error in aggregate2:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Aggregation 3: Unwind genres array into separate documents
export const aggregate3 = async (req, res) => {
    try {
        const books = await getBooksCollection().aggregate([
            { $unwind: "$genres" }
        ]).toArray();
        
        res.status(200).json({ 
            message: "Books with genres unwound into separate documents",
            count: books.length, 
            books 
        });
    } catch (error) {
        console.error("Error in aggregate3:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Aggregation 4: Join books collection with logs collection
export const aggregate4 = async (req, res) => {
    try {
        const books = await getBooksCollection().aggregate([
            {
                $lookup: {
                    from: "logs",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "logs"
                }
            }
        ]).toArray();
        
        res.status(200).json({ 
            message: "Books joined with logs collection",
            count: books.length, 
            books 
        });
    } catch (error) {
        console.error("Error in aggregate4:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};