
// Question 1
class User {
    notebooks: NoteBook[] = [];

    constructor(
        public Id: number,
        public name: string,
        public email: string,
        protected password: string,
        public phone: string,
        public age: number
    ) {
        if (age < 18 || age > 60) {
            throw new Error("Age must be between 18 and 60.");
        }
    }

    displayInfo(): void {
        console.log(`Id: ${this.Id}, Name: ${this.name}, Email: ${this.email}, Phone: ${this.phone}, Age: ${this.age}`);
    }

    // Question 5 – Aggregation methods
    addNotebook(notebook: NoteBook): void {
        this.notebooks.push(notebook);
        console.log(`NoteBook added to user "${this.name}".`);
    }

    removeNotebook(notebook: NoteBook): void {
        this.notebooks = this.notebooks.filter(nb => nb !== notebook);
        console.log(`NoteBook removed from user "${this.name}".`);
    }
}

// Question 2
class Admin extends User {
    private notes: Note[] = [];

    manageNotes(action: "add" | "delete", note: Note): void {
        if (action === "add") {
            this.notes.push(note);
            console.log(`Note "${note.title}" added.`);
        } else {
            this.notes = this.notes.filter(n => n.Id !== note.Id);
            console.log(`Note "${note.title}" deleted.`);
        }
    }
}

// Question 3 & 6 – Association: Note references a User (author) but does not own it
class Note {
    constructor(
        public Id: number,
        public title: string,
        public content: string,
        public userId: User   // Association: author of the note
    ) {}

    preview(): string {
        return this.content;
    }
}

// Question 4 – Composition: NoteBook owns its Notes; Notes cannot exist without the NoteBook
class NoteBook {
  
    private notes: Note[] = [];

    addNote(note: Note): void {
        this.notes.push(note);
        console.log(`Note "${note.title}" added to notebook.`);
    }

    removeNote(noteId: number): void {
        this.notes = this.notes.filter(note => note.Id !== noteId);
        console.log(`Note with Id "${noteId}" removed from notebook.`);
    }

    getNotes(): Note[] {
        return this.notes;
    }
}

// Question 7 
class Storage<T> {
    private items: T[] = [];

    addItem(item: T): void {
        this.items.push(item);
        console.log(`Item added to storage.`);
    }

    removeItem(item: T): void {
        this.items = this.items.filter(i => i !== item);
        console.log(`Item removed from storage.`);
    }

    getAllItems(): T[] {
        return this.items;
    }
}