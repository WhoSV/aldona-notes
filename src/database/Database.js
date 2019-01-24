import SQLite from 'react-native-sqlite-storage';
import Moment from 'moment';
import DatabaseInitialization from './DatabaseInitialization';

export class Database {
  database;

  // Open the connection to the database
  open() {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);

    let databaseInstance;

    return SQLite.openDatabase({
      name: 'AppDatabase.db',
      location: 'default',
    })
      .then((db) => {
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
      return Promise.reject(new Error('[db] Database was not open; unable to close.'));
    }
    return this.database.close().then(() => {
      console.log('[db] Database closed.');
      this.database = undefined;
    });
  }

  createFolder(newFolderTitle) {
    const newFolder = newFolderTitle.charAt(0).toUpperCase() + newFolderTitle.slice(1);

    return this.getDatabase()
      .then(db => db.executeSql('INSERT INTO Folder (title, updated_at) VALUES (?, ?);', [newFolder, Moment().format()]))
      .then(([results]) => {
        const { insertId } = results;
        console.log(`[db] Added folder with title: "${newFolder}"! InsertId: ${insertId}`);
      });
  }

  updateFolder(folder, newFolderTitle) {
    const newFolder = newFolderTitle.charAt(0).toUpperCase() + newFolderTitle.slice(1);

    console.log(`[db] Updating folder: "${folder.title}" with id: ${folder.id}`);
    return this.getDatabase()
      .then(db => db.executeSql('UPDATE Folder set title = ?, updated_at = ? where id = ?;', [newFolder, Moment().format(), folder.id]))
      .then(() => {
        console.log(`[db] Updated folder with title: "${folder.title}"! Now new title: ${newFolder}`);
      });
  }

  getAllFolders() {
    console.log('[db] Fetching folders from the db...');

    // Get all the fodlers, ordered by newest folder first
    return this.getDatabase()
      .then(db => db.executeSql('SELECT title, id, updated_at as updatedAt FROM Folder ORDER BY id DESC;'))
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const folders = [];
        for (let i = 0; i < count; i += 1) {
          const row = results.rows.item(i);
          const { title, id, updatedAt } = row;
          console.log(`[db] Folder title: ${title}, id: ${id}`);
          folders.push({ id, title, updatedAt });
        }
        return folders;
      });
  }

  deleteFolder(folder) {
    console.log(`[db] Deleting folder titled: "${folder.title}" with id: ${folder.id}`);

    // Delete folder notes first, then delete the folder itself
    return this.getDatabase()
      .then(db => db.executeSql('DELETE FROM Note WHERE folder_id = ?;', [folder.id]).then(() => db))
      .then(db => db.executeSql('DELETE FROM Folder WHERE id = ?;', [folder.id]))
      .then(() => {
        console.log(`[db] Deleted folder titled: "${folder.title}"!`);
      });
  }

  getNotesCount(folder) {
    console.log('[db] Fetching folders notes count from the db...');

    // Get folders notes count
    return this.getDatabase()
      .then(db => db.executeSql('SELECT count(*) as count FROM Note WHERE folder_id = ?;', [folder.id]))
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

  createNote(newText, folder) {
    // Remove spaces from string
    const text = newText.trim();

    if (folder === undefined) {
      return Promise.reject(new Error('Could not add note to undefined folder.'));
    }
    return this.getDatabase()
      .then(db => db.executeSql('INSERT INTO Note (text, updated_at, folder_id) VALUES (?, ?, ?);', [text, Moment().format(), folder.id]))
      .then(([results]) => {
        const { insertId } = results;
        console.log(`[db] Note with "${text}" created successfully with id: ${insertId}`);
      });
  }

  updateNote(newText, note) {
    // Remove spaces from string
    const text = newText.trim();

    console.log(`[db] Updating note: "${note.text}" with id: ${note.id}`);
    return this.getDatabase()
      .then(db => db.executeSql('UPDATE Note set text = ?, updated_at = ? where id = ?;', [text, Moment().format(), note.id]))
      .then(() => {
        console.log(`[db] Updated note with text: "${note.text}"! Now new text: ${text}`);
      });
  }

  getNotesByFolderId(folder, sortBy) {
    if (folder === undefined) {
      return Promise.resolve([]);
    }

    const sort = sortBy || 'id DESC';

    return this.getDatabase()
      .then(db => db.executeSql(`SELECT id, text, updated_at as updatedAt, folder_id as folderId FROM Note WHERE folder_id = ? ORDER BY ${sort};`, [folder.id]))
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const note = [];
        for (let i = 0; i < count; i += 1) {
          const row = results.rows.item(i);
          const {
            id, text, updatedAt, folderId,
          } = row;
          console.log(`[db] List note id: ${id} text: ${text}, updated_at: ${updatedAt}, fodlerId: ${folderId} `);
          note.push({
            id,
            text,
            updatedAt,
            folderId,
          });
        }
        console.log(`[db] List notes for folder "${folder.title}":`, note);
        return note;
      });
  }

  deleteNote(note) {
    console.log(`[db] Deleting note titled: "${note.text}" with id: ${note.id}`);
    return this.getDatabase()
      .then(db => db.executeSql('DELETE FROM Note WHERE id = ?;', [note.id]).then(() => db))
      .then(() => {
        console.log(`[db] Deleted note titled: "${note.text}"!`);
      });
  }

  getConfigs() {
    console.log('[db] Fetching configs from the db...');
    return this.getDatabase()
      .then(db => db.executeSql('SELECT title, id, data FROM Config;'))
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const configs = [];
        for (let i = 0; i < count; i += 1) {
          const row = results.rows.item(i);
          const { title, id } = row;
          const data = JSON.parse(row.data);
          console.log(`[db] Config title: ${title}, id: ${id}`);
          configs.push({ id, title, data });
        }
        return configs;
      });
  }

  updateConfig(section, newConfigData) {
    console.log(`[db] Updating configs: "${newConfigData.name}"`);
    // Attach new config in []
    const config = `[${JSON.stringify(newConfigData)}]`;
    return this.getDatabase()
      .then(db => db.executeSql('UPDATE Config set data = ? where id = ?;', [config, section.id]))
      .then(() => {
        console.log(`[db] Updated config with title: "${newConfigData.name}"!`);
      });
  }

  getDatabase() {
    if (this.database !== undefined) {
      return Promise.resolve(this.database);
    }
    // Otherwise: open the database first
    return this.open();
  }
}

// Export a single instance of DatabaseImpl
export const database = new Database();
