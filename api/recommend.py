from http.server import BaseHTTPRequestHandler
import sqlite3
import json
import requests
import os

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = json.loads(self.rfile.read(content_length))
        question = post_data.get("question", "")

        # 1. Talk to Snow Leopard
        api_key = os.environ.get("SNOW_LEOPARD_API_KEY")
        sl_res = requests.post(
            "https://api.snowleopard.ai/v1/retrieve",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"question": question}
        )
        sql = sl_res.json().get("sql")

        # 2. Query the Local SQLite file
        conn = sqlite3.connect('netflix.db')
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        conn.close()

        # 3. Send Response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"results": rows, "sql": sql}).encode())