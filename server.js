import { streamText, tool, jsonSchema } from 'ai';
import express from 'express';
import { openai } from '@ai-sdk/openai';
import { SnowLeopardClient } from "@snowleopard-ai/client";
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
      system: 'You are a helpful movie assistant. Always summarize the results you find in a friendly, readable way.',
      tools: {
        getMovieData: tool({
          description: 'Search the movie database for titles and descriptions.',
          parameters: jsonSchema({
            type: 'object',
            properties: {
              userQuestion: {
                type: 'string',
                description: 'The search query for movies',
              },
            },
            required: ['userQuestion'],
            additionalProperties: false,
          }),
          execute: async ({ userQuestion }) => {
            console.log("🔍 Tool calling SnowLeopard for:", userQuestion);
            return await snowy.retrieve({ 
              userQuery: userQuestion, 
              datafileId: process.env.SNOWLEOPARD_DATAFILE_ID 
            });
          },
        }),
      },
      maxSteps: 5,
    });
    result.finishReason.then(r => console.log("🏁 Finish reason:", r));
    result.usage.then(u => console.log("📊 Usage:", u));
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    for await (const chunk of result.fullStream) {
      console.log("📦 Chunk:", JSON.stringify(chunk));
      if (chunk.type === 'text-delta') {
        res.write(chunk.textDelta);
      }
    }

    return res.end();

  } catch (error) {
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