# Movie AI Chat Agent
An intelligent chat interface that uses **OpenAI GPT-4o** and **SnowLeopard AI** to search a movie database and provide recommendations.

## Ownership and Completeness Disclaimer
- This is only partially complete, because it is the section of the project I worked on for the Hackathon.
- My teammates did the frontend in React, but we did not have a complete demonstration by the time limit. 

## Features
- **Streaming Responses**: Real-time text generation for a smooth user experience.
- **Tool Calling**: Integrated with SnowLeopard AI to query a SQLite movie database.
- **Express Backend**: A lightweight Node.js server handling API requests.

## Tech Stack
- **Framework**: Express.js
- **LLM**: OpenAI GPT-4o
- **Database Query**: SnowLeopard AI (Vector Search / Retrieval)

## Prerequisites
- Node.js (v18+)
- OpenAI API Key
- SnowLeopard API Key

## Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file and add your keys:
   ```env
   OPENAI_API_KEY=your_key_here
   SNOWLEOPARD_API_KEY=your_key_here
   SNOWLEOPARD_DATAFILE_ID=your_id_here

## 🧪 Testing the API
Since this repository focuses on the backend engine, you can test the streaming AI response and tool-calling logic using PowerShell or cURL:

```powershell
$body = @{
    messages = @(
        @{ role = "user"; content = "Search the database for a cool sci-fi movie." }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method Post -Body $body -ContentType "application/json"