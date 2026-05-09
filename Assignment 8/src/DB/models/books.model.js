import { db } from "./connection.js";  

// Export an object that lazily gets the collection when accessed
export default {
  get collection() {
    return db.collection("books");
  }
};