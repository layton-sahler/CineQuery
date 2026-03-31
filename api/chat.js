import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { SnowLeopardClient } from "@snowleopard-ai/client";
import { z } from 'zod';

// 1. Debug check: This will show up in your Vercel logs so we can be sure
if (!process.env.SNOWLEOPARD_API_KEY) {
  console.error("CRITICAL: SNOWLEOPARD_API_KEY is missing from environment variables!");
}

// 2. Initialize with the key explicitly
const snowy = new SnowLeopardClient({
  apiKey: process.env.SNOWLEOPARD_API_KEY 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { messages } = req.body;

  try {
    const result = await streamText({
      model: openai('gpt-4o'),
      messages,
      tools: {
        getMovieData: tool({
          description: 'Search the movie database for titles, ratings, and descriptions.',
          parameters: z.object({
            userQuestion: z.string().describe('The search query for movies'),
          }),
          execute: async ({ userQuestion }) => {
            return await snowy.retrieve({ 
              userQuery: userQuestion, 
              datafileId: process.env.SNOWLEOPARD_DATAFILE_ID 
            });
          },
        }),
      },
    });

    return result.pipeDataStreamToResponse(res);
  } catch (error) {
    console.error("Runtime Error:", error);
    return res.status(500).json({ error: error.message });
  }
}