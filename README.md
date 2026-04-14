CineQuery
An intelligent movie discovery engine that leverages OpenAI GPT-4o and SnowLeopard AI to provide high-quality recommendations from a specialized movie database.

Overview
CineQuery is a backend-driven AI agent capable of understanding natural language movie requests. It uses advanced RAG (Retrieval-Augmented Generation) techniques to query a SQLite database and stream human-like responses back to the user.

Features
Streaming AI Responses: Uses the Vercel AI SDK to stream text character-by-character for a modern chat experience.

Contextual Tool Calling: Dynamically triggers the getMovieData tool to fetch real movie specs (titles, ratings, descriptions) based on user intent.

Vectorized Retrieval: Integrated with SnowLeopard AI for efficient data querying.

Express.js Backend: A robust Node.js server optimized for high-performance AI interactions.

Tech Stack
Language: Node.js (ES Modules)

Framework: Express.js

LLM: OpenAI GPT-4o

Retrieval: SnowLeopard AI Client

Schema Validation: Zod

Prerequisites
Node.js (v18 or higher)

An OpenAI API Key

SnowLeopard API Key & Datafile ID

Installation & Setup
Clone the repository:

Bash
git clone https://github.com/layton-sahler/CineQuery.git
cd CineQuery
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env file in the root directory:

Code snippet
OPENAI_API_KEY=your_openai_key
SNOWLEOPARD_API_KEY=your_snowleopard_key
SNOWLEOPARD_DATAFILE_ID=your_datafile_id
Start the Server:

Bash
node server.js
Testing the API
You can test the backend logic using PowerShell to simulate a user chat:

PowerShell
$body = @{
    messages = @(
        @{ role = "user"; content = "I'm looking for a dark sci-fi movie from the 2010s." }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method Post -Body $body -ContentType "application/json"
Ownership & Completeness Disclaimer
This project is an MVP (Minimum Viable Product) developed during a Hackathon.

Backend & AI Logic: Developed entirely by me (Layton Sahler). This repository contains the functional core of the application.

Frontend: My teammates worked on a React-based frontend; however, due to the hackathon time constraints, a complete end-to-end demonstration was not finalized. This repo serves as a showcase for the backend engine.
