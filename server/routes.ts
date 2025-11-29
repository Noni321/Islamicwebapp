import type { Express } from "express";
import { createServer, type Server } from "http";
import { chatMessageSchema, type ChatResponse } from "@shared/schema";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      // Ensure content-type is application/json
      if (!req.is('application/json')) {
        return res.status(400).json({ 
          error: "Content-Type must be application/json",
          response: "Invalid request format."
        });
      }
      
      const body = chatMessageSchema.parse(req.body);
      
      const apiKey = process.env.MOSLEM_BOT_API_KEY;
      const userId = process.env.MOSLEM_BOT_USER_ID;
      
      if (!apiKey || !userId) {
        console.error("Missing required environment variables: MOSLEM_BOT_API_KEY or MOSLEM_BOT_USER_ID");
        return res.status(500).json({ 
          error: "Server configuration error",
          response: "The Islamic bot service is not properly configured. Please contact the administrator."
        });
      }
      
      // Format conversation history exactly as API expects: string with nested arrays
      // Add system instruction at the start for English responses
      const historyWithInstruction = body.conversationHistory && body.conversationHistory.length > 0
        ? body.conversationHistory
        : [];
      
      // Prepend system instruction if no history exists
      const withSystemInstruction = historyWithInstruction.length === 0
        ? [["System: Always respond in English language regardless of the question language.", "Understood. I will always respond in English."]]
        : historyWithInstruction;
      
      const conversationHistoryString = `[${withSystemInstruction.map(([q, a]) => `[\"${q.replace(/"/g, '\\"')}\", \"${a.replace(/"/g, '\\"')}\"]`).join(', ')}]`;
      
      const requestBody = {
        data: [
          body.message,
          2048,
          0.7,
          0.95,
          conversationHistoryString,
        ],
      };
      
      console.log("API Request Body:", JSON.stringify(requestBody, null, 2));
      
      const response = await fetch("https://api.moslembot.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          "X-User-Id": userId,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error(`Moslem Bot API error (${response.status}):`, errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      console.log("API Response Data:", JSON.stringify(data, null, 2));
      
      // The API returns the response directly in a "response" field
      if (!data || !data.response || typeof data.response !== 'string') {
        console.error("Invalid API response structure:", data);
        return res.status(500).json({
          error: "Invalid response from API",
          response: "I apologize, but I received an invalid response. Please try again."
        });
      }
      
      const chatResponse: ChatResponse = {
        response: data.response,
      };

      res.json(chatResponse);
    } catch (error) {
      console.error("Error calling Moslem Bot API:", error);
      res.status(500).json({ 
        error: "Failed to get response from Islamic bot",
        response: "I apologize, but there was an error processing your question. Please try again."
      });
    }
  });

  app.get("/api/hijri-date", async (_req, res) => {
    try {
      const { stdout } = await execAsync("python server/hijri_date.py");
      res.json({ date: stdout.trim() });
    } catch (error) {
      console.error("Error getting Hijri date:", error);
      res.status(500).json({ error: "Failed to get Hijri date" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
