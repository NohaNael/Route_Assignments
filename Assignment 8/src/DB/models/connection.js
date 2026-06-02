import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config/dev.env" });
const uri = process.env.URI;
const client = new MongoClient(uri);
export const db = client.db("myDatabase");

// Create books collection with validation
const createBooksCollection = async () => {
  try {
    const collections = await db.listCollections({ name: "books" }).toArray();
    
    if (collections.length === 0) {
      // Create new collection with validation
      await db.createCollection("books", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["title"],
            properties: {
              title: {
                bsonType: "string",
                description: "title must be a non-empty string and is required",
                minLength: 1
              }
            }
          }
        },
        validationLevel: "strict",
        validationAction: "error"
      });
      console.log("Books collection created with validation rules");
    } else {
      // Update existing collection with validation
      await db.command({
        collMod: "books",
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["title"],
            properties: {
              title: {
                bsonType: "string",
                description: "title must be a non-empty string and is required",
                minLength: 1
              }
            }
          }
        },
        validationLevel: "strict",
        validationAction: "error"
      });
      console.log("Validation rules applied to existing books collection");
    }
  } catch (error) {
    console.error("Error setting up books collection:", error);
  }
};

export const connectToDB = async () => {
  try {
    await client.connect();     
    console.log("Connected to MongoDB");
    await createBooksCollection();
  }
    catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};