export class DatabaseInitialization {
  // Perform any updates to the database schema. These can occur during initial configuration, or after an app store update.
  // This should be called each time the database is opened.
  updateDatabaseTables(database) {
    let dbVersion = 0;
    console.log('Beginning database updates...');

    // First: create tables if they do not already exist
    return database
      .transaction(this.createTables)
      .then(() => {
        // Get the current database version
        return this.getDatabaseVersion(database);
      })
      .then(version => {
        dbVersion = version;
        console.log('Current database version is: ' + dbVersion);

        // Perform DB updates based on this version

        // This is included as an example of how you make database schema changes once the app has been shipped
        if (dbVersion < 1) {
          // Uncomment the next line, and the referenced function below, to enable this
          // return database.transaction(this.preVersion1Inserts);
        }
        // otherwise,
        return;
      })
      .then(() => {
        if (dbVersion < 2) {
          // Uncomment the next line, and the referenced function below, to enable this
          // return database.transaction(this.preVersion2Inserts);
        }
        // otherwise,
        return;
      });
  }

  // Perform initial setup of the database tables
  createTables(transaction) {
    // DANGER! For dev only
    const dropAllTables = false;
    if (dropAllTables) {
      transaction.executeSql('DROP TABLE IF EXISTS Folder;');
      transaction.executeSql('DROP TABLE IF EXISTS Note;');
      transaction.executeSql('DROP TABLE IF EXISTS Version;');
    }

    // Folder table
    transaction.executeSql(
      'CREATE TABLE IF NOT EXISTS Folder( ' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'title TEXT, ' +
        'updated_at TEXT' +
        ');'
    );

    // Note table
    transaction.executeSql(
      'CREATE TABLE IF NOT EXISTS Note( ' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'folder_id INTEGER, ' +
        'text TEXT, ' +
        'updated_at TEXT, ' +
        'FOREIGN KEY ( folder_id ) REFERENCES Folder ( id )' +
        ');'
    );

    // Version table
    transaction.executeSql(
      'CREATE TABLE IF NOT EXISTS Version( ' +
        'version_id INTEGER PRIMARY KEY NOT NULL, ' +
        'version INTEGER' +
        ');'
    );
  }

  // Get the version of the database, as specified in the Version table
  getDatabaseVersion(database) {
    // Select the highest version number from the version table
    return database
      .executeSql('SELECT version FROM Version ORDER BY version DESC LIMIT 1;')
      .then(([results]) => {
        if (results.rows && results.rows.length > 0) {
          const version = results.rows.item(0).version;
          return version;
        } else {
          return 0;
        }
      })
      .catch(error => {
        console.log(`No version set. Returning 0. Details: ${error}`);
        return 0;
      });
  }

  // Once the app has shipped, use the following functions as a template for updating the database:
  /*
    // This function should be called when the version of the db is < 1
    private preVersion1Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 1 DB inserts");

        // Make schema changes
        transaction.executeSql("ALTER TABLE ...");

        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (1);");
    }

    // This function should be called when the version of the db is < 2
    private preVersion2Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 2 DB inserts");
        
        // Make schema changes
        transaction.executeSql("ALTER TABLE ...");

        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (2);");
    }
    */
}
