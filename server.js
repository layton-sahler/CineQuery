import express from 'express';
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { SnowLeopardClient } from "@snowleopard-ai/client";
import { z } from 'zod';
import 'dotenv/config';

console.log("--- Starting Server Script ---");

const app = express();
app.use(express.json());

const snowy = new SnowLeopardClient({
  apiKey: process.env.SNOWLEOPARD_API_KEY 
});

app.post('/api/chat', async (req, res) => {
  console.log("📩 Received a request to /api/chat");
  const { messages } = req.body;

  try {
    const result = await streamText({
      model: openai('gpt-4o'),
      messages,
      tools: {
        getMovieData: {
          description: 'Search the movie database for titles and descriptions.',
          // We bypass Zod entirely here to ensure no "None" type is generated
          parameters: {
            type: 'object',
            properties: {
              userQuestion: {
                type: 'string',
                description: 'The search query for movies',
              },
            },
            required: ['userQuestion'],
            additionalProperties: false, // OpenAI likes this for strictness
          },
          execute: async ({ userQuestion }) => {
            console.log("🔍 Tool calling SnowLeopard for:", userQuestion);
            return await snowy.retrieve({ 
              userQuery: userQuestion, 
              datafileId: process.env.SNOWLEOPARD_DATAFILE_ID 
            });
          },
        },
      },
      maxSteps: 5,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    for await (const textPart of result.textStream) {
      res.write(textPart);
    }

    return res.end();

  } catch (error) {
    // This will print the EXACT reason OpenAI is mad in your terminal
    console.error("❌ Runtime Error details:", error.data?.error || error);
    if (!res.headersSent) {
      res.status(500).send(error.message);
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 SUCCESS: Server is listening on http://localhost:${PORT}`);
});