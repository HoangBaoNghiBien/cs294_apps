// NotesDatabase object
class MyNotesDB {
  /**
   * Creates new instance of Notes Database
   * @dependency Dexie.JS
   **/
  constructor() {
    this.db = new Dexie("MyNotesDB");
    this.db.version(3).stores({
      notes: '++id,type,title,text,image',
    });
  }

  /**
   * Gets an array of all notes in the database
   * @returns {Note[]} note objects in the database
   **/
  async getListOfNotes() {
    return await this.db.notes.toArray();
  }

  /**
   * Gets an array of notes in the database beginning with query
   * @param {string} query - query to match items in database with
   * @returns {Note[]} note objects in database matching query
   **/
  async searchNotes(query) {
    const notes = await this.db.notes.toArray();
    return notes.filter(
      (note) => note.text.toLowerCase().includes(query.toLowerCase()) ||
        note.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Gets a single note in the database by id
   * @param {number} id - value of id key in the database
   * @returns {Note} note object in database
   **/
  async getNote(id) {
    return await this.db.notes.where({ id }).first();
  }

  /**
   * Creates a new note in the database
   * @param {string} text - value of note to store
   * @param {string} image - value of image to store
   * @returns {Note} note object created
   **/
  async createNote(type, title, text, image) {
    return await this.db.notes.add({ type, title, text, image }).then((noteId) => {
      return this.getNote(noteId);
    }).catch(err => {
      alert("An error occured while inserting a note: " + err);
    });
  }

  /**
   * Updates note in the database
   * @param {number} id - id of note
   * @param {string} title - new title
   * @param {string} text - new text
   * @param {string} image - new image
   **/
  async updateNote(id, type, title, text, image) {
    return await this.db.notes.update(id, { type, title, text, image }).then((update) => {
      return true;
    })
  }

  // Delete note in database
  async deleteNote(id) {
    return await this.db.notes.delete(id);
  }
}