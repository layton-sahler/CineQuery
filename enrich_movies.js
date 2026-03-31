const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const SOURCE_DB = "netflix.db";
const TARGET_DB = "netflix_enriched.db";
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const TABLE_NAME = "movies";
const ID_COLUMN = "id";
const TITLE_COLUMN = "title";

if (!OMDB_API_KEY) {
  console.error("Missing OMDB_API_KEY in .env");
  process.exit(1);
}

if (!fs.existsSync(SOURCE_DB)) {
  console.error(`Source DB not found: ${SOURCE_DB}`);
  process.exit(1);
}

fs.copyFileSync(SOURCE_DB, TARGET_DB);

const db = new sqlite3.Database(TARGET_DB, (err) => {
  if (err) {
    console.error("Error opening target DB:", err.message);
    process.exit(1);
  }
  console.log(`Connected to ${TARGET_DB}`);
});

function run(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function runWithParams(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function addColumnIfMissing(tableName, columnName, columnType) {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  const columnNames = columns.map((col) => col.name);

  if (!columnNames.includes(columnName)) {
    await run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
    console.log(`Added column: ${columnName}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    await addColumnIfMissing(TABLE_NAME, "plot", "TEXT");
    await addColumnIfMissing(TABLE_NAME, "poster_url", "TEXT");
    await addColumnIfMissing(TABLE_NAME, "director", "TEXT");

    const movies = await all(`SELECT ${ID_COLUMN}, ${TITLE_COLUMN} FROM ${TABLE_NAME}`);

    for (const movie of movies) {
      const movieId = movie[ID_COLUMN];
      const title = movie[TITLE_COLUMN];

      try {
        console.log(`Fetching: ${title}`);

        const response = await axios.get("http://www.omdbapi.com/", {
          params: {
            apikey: OMDB_API_KEY,
            t: title,
          },
          timeout: 10000,
        });

        const data = response.data;

        if (data.Response === "True") {
          const plot = data.Plot || null;
          const posterUrl = data.Poster || null;
          const director = data.Director || null;

          await runWithParams(
            `UPDATE ${TABLE_NAME}
             SET plot = ?, poster_url = ?, director = ?
             WHERE ${ID_COLUMN} = ?`,
            [plot, posterUrl, director, movieId]
          );
        } else {
          console.log(`No OMDb match for: ${title}`);
        }

        await sleep(200);
      } catch (err) {
        console.error(`Error on ${title}:`, err.message);
      }
    }

    console.log("Done. Enriched database saved as netflix_enriched.db");
  } catch (err) {
    console.error("Script failed:", err.message);
  } finally {
    db.close();
  }
}

main();