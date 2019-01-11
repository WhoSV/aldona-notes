import SQLite from 'react-native-sqlite-storage';
import { DatabaseInitialization } from './DatabaseInitialization';
import Moment from 'moment';

export class Database {
  database;

  // Open the connection to the database
  open() {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);

    let databaseInstance;

    return SQLite.openDatabase({
      name: 'AppDatabase.db',
      location: 'default'
    })
      .then(db => {
        databaseInstance = db;
        console.log('[db] Database open!');

        // Perform any database initialization or updates, if needed
        const databaseInitialization = new DatabaseInitialization();
        return databaseInitialization.updateDatabaseTables(databaseInstance);
      })
      .then(() => {
        this.database = databaseInstance;
        return databaseInstance;
      });
  }

  // Close the connection to the database
  close() {
    if (this.database === undefined) {
      return Promise.reject('[db] Database was not open; unable to close.');
    }
    return this.database.close().then(status => {
      console.log('[db] Database closed.');
      this.database = undefined;
    });
  }

  createFolder(newFolderTitle) {
    return this.getDatabase()
      .then(db => db.executeSql('INSERT INTO Folder (title, updated_at) VALUES (?, ?);', [newFolderTitle, Moment(new Date()).calendar()]))
      .then(([results]) => {
        const { insertId } = results;
        console.log(`[db] Added folder with title: "${newFolderTitle}"! InsertId: ${insertId}`);
      });
  }

  updateFolder(folder, newFolderTitle) {
    console.log(`[db] Updating folder: "${folder.title}" with id: ${folder.id}`);
    return this.getDatabase()
      .then(db => db.executeSql('UPDATE Folder set title = ?, updated_at = ? where id = ?;', [newFolderTitle, Moment(new Date()).calendar(), folder.id]))
      .then(() => {
        console.log(`[db] Updated folder with title: "${folder.title}"! Now new title: ${newFolderTitle}`);
      });
  }

  getAllFolders() {
    console.log('[db] Fetching folders from the db...');
    return this.getDatabase()
      .then(db =>
        // Get all the fodlers, ordered by newest folder first
        db.executeSql('SELECT * FROM Folder ORDER BY id DESC;')
      )
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const folders = [];
        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          const { title, id, updated_at } = row;
          console.log(`[db] Folder title: ${title}, id: ${id}`);
          folders.push({ id, title, updated_at });
        }
        return folders;
      });
  }

  deleteFolder(folder) {
    console.log(`[db] Deleting folder titled: "${folder.title}" with id: ${folder.id}`);
    return this.getDatabase()
      .then(db => {
        // Delete folder notes first, then delete the folder itself
        return db.executeSql('DELETE FROM Note WHERE folder_id = ?;', [folder.id]).then(() => db);
      })
      .then(db => db.executeSql('DELETE FROM Folder WHERE id = ?;', [folder.id]))
      .then(() => {
        console.log(`[db] Deleted folder titled: "${folder.title}"!`);
        return;
      });
  }

  getNotesCount(folder) {
    console.log('[db] Fetching folders notes count from the db...');
    return this.getDatabase()
      .then(db =>
        // Get folders notes count
        db.executeSql('SELECT count(*) as count FROM Note WHERE folder_id = ?;', [folder.id])
      )
      .then(([results]) => {
        if (results === undefined) {
          return 0;
        }

        const row = results.rows.item(0);
        const { count } = row;
        console.log(`[db] Notes count: ${count} in folder: ${folder.title}`);
        return count;
      });
  }

  createNote(text, folder) {
    // Remove spaces from string
    text = text.trim();

    if (folder === undefined) {
      return Promise.reject(Error(`Could not add note to undefined folder.`));
    }
    return this.getDatabase()
      .then(db => db.executeSql('INSERT INTO Note (text, updated_at, folder_id) VALUES (?, ?, ?);', [text, Moment(new Date()).calendar(), folder.id]))
      .then(([results]) => {
        const { insertId } = results;
        console.log(`[db] Note with "${text}" created successfully with id: ${insertId}`);
      });
  }

  updateNote(text, note) {
    // Remove spaces from string
    text = text.trim();

    console.log(`[db] Updating note: "${note.text}" with id: ${note.id}`);
    return this.getDatabase()
      .then(db => db.executeSql('UPDATE Note set text = ?, updated_at = ? where id = ?;', [text, Moment(new Date()).calendar(), note.id]))
      .then(() => {
        console.log(`[db] Updated note with text: "${note.text}"! Now new text: ${text}`);
      });
  }

  getNotesByFolderId(folder) {
    if (folder === undefined) {
      return Promise.resolve([]);
    }
    return this.getDatabase()
      .then(db => db.executeSql(`SELECT * FROM Note WHERE folder_id = ? ORDER BY updated_at DESC;`, [folder.id]))
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const note = [];
        for (let i = 0; i < count; i++) {
          const row = results.rows.item(i);
          const { id, text, updated_at, folder_id } = row;
          console.log(`[db] List note id: ${id} text: ${text}, updated_at: ${updated_at}, fodlerId: ${folder_id} `);
          note.push({ id, text, updated_at, folder_id });
        }
        console.log(`[db] List notes for folder "${folder.title}":`, note);
        return note;
      });
  }

  deleteNote(note) {
    console.log(`[db] Deleting note titled: "${note.text}" with id: ${note.id}`);
    return this.getDatabase()
      .then(db => {
        return db.executeSql('DELETE FROM Note WHERE id = ?;', [note.id]).then(() => db);
      })
      .then(() => {
        console.log(`[db] Deleted note titled: "${note.text}"!`);
        return;
      });
  }

  getDatabase() {
    if (this.database !== undefined) {
      return Promise.resolve(this.database);
    }
    // otherwise: open the database first
    return this.open();
  }
}

// Export a single instance of DatabaseImpl
export const database = new Database();
