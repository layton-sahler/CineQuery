const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("netflix.db", sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }
  console.log("Connected to netflix.db");
});

db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
  if (err) {
    console.error("Error fetching tables:", err.message);
    db.close();
    return;
  }

  console.log("Tables:");
  console.log(tables);

  if (!tables.length) {
    db.close();
    return;
  }

  let remaining = tables.length;

  tables.forEach((tableObj) => {
    const tableName = tableObj.name;
    console.log(`\nSchema for ${tableName}:`);

    db.all(`PRAGMA table_info(${tableName});`, [], (err, columns) => {
      if (err) {
        console.error(`Error reading schema for ${tableName}:`, err.message);
      } else {
        console.log(columns);
      }

      remaining -= 1;
      if (remaining === 0) {
        db.close();
      }
    });
  });
});