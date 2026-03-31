AI Movie Recommender

An AI powered movie recommendation system that enables users to ask natural language questions and receive personalized movie suggestions in real time.

Developed during a hackathon by Team TripeTSahur.

Team

Tanish  
Sean  
Henry  
Layton  

Overview

This project is a full stack application that integrates an intuitive frontend with an intelligent backend to deliver context aware movie recommendations.

Instead of manually browsing through large catalogs, users can enter prompts such as:

“Give me an action movie from the 90s”  
“I want something emotional but not too long”  
“Movies with a strong female lead”  

The system processes these queries and returns relevant recommendations along with brief explanations.

How It Works

The user submits a query through the frontend interface  
The frontend sends the request to the backend API  
The backend processes the query using Snow Leopard to query a SQLite movie database and OpenAI to refine and generate explanations  
The backend returns structured recommendation results  
The frontend renders results in a Netflix inspired interface  

Tech Stack

Frontend:  
React  
Custom Netflix inspired UI  

Backend:  
Node.js  
Express  
Snow Leopard API  
OpenAI API  

Database  
SQLite  
Enriched using the OMDb API  

Features

Natural language based movie search  
AI generated recommendations with explanations  
Clean and responsive Netflix style interface  
Lightweight SQLite database  
Enriched movie metadata including plot, director, and posters  
