import sqlite3
import requests
import shutil
import time

OMDB_API_KEY = "YOUR_OMDB_API_KEY"

SOURCE_DB = "netflix.db"
TARGET_DB = "netflix_enriched.db"

# Copy original DB so we do not modify it directly
shutil.copyfile(SOURCE_DB, TARGET_DB)

conn = sqlite3.connect(TARGET_DB)
cursor = conn.cursor()

def add_column_if_missing(table_name, column_name, column_type):
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]
    if column_name not in columns:
        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")

TABLE_NAME = "movies"   # change this if needed
ID_COLUMN = "id"        # change this if needed
TITLE_COLUMN = "title"  # change this if needed

add_column_if_missing(TABLE_NAME, "plot", "TEXT")
add_column_if_missing(TABLE_NAME, "poster_url", "TEXT")
add_column_if_missing(TABLE_NAME, "director", "TEXT")

conn.commit()

cursor.execute(f"SELECT {ID_COLUMN}, {TITLE_COLUMN} FROM {TABLE_NAME}")
movies = cursor.fetchall()

for movie_id, title in movies:
    try:
        print(f"Fetching: {title}")

        response = requests.get(
            "http://www.omdbapi.com/",
            params={
                "apikey": OMDB_API_KEY,
                "t": title
            },
            timeout=10
        )

        data = response.json()

        if data.get("Response") == "True":
            plot = data.get("Plot")
            poster_url = data.get("Poster")
            director = data.get("Director")

            cursor.execute(f"""
                UPDATE {TABLE_NAME}
                SET plot = ?, poster_url = ?, director = ?
                WHERE {ID_COLUMN} = ?
            """, (plot, poster_url, director, movie_id))

            conn.commit()
        else:
            print(f"No OMDb match for: {title}")

        time.sleep(0.2)

    except Exception as e:
        print(f"Error on {title}: {e}")

conn.close()
print("Done. Enriched database saved as netflix_enriched.db")