import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { SnowLeopardClient } from "@snowleopard-ai/client";
import { z } from 'zod';

const snowy = new SnowLeopardClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { messages } = req.body;

  const result = await streamText({
    model: openai('gpt-4o'), // Or the model you prefer
    messages,
    tools: {
      getMovieData: tool({
        description: 'Search the movie database for titles, ratings, and descriptions.',
        parameters: z.object({
          userQuestion: z.string().describe('The search query for movies'),
        }),
        execute: async ({ userQuestion }) => {
          // This uses your Datafile ID from the environment
          return await snowy.retrieve({ 
            userQuery: userQuestion, 
            datafileId: process.env.SNOWLEOPARD_DATAFILE_ID 
          });
        },
      }),
    },
  });

  // This helper makes the streaming work automatically with Vercel
  return result.pipeDataStreamToResponse(res);
}