import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/chat", async (req, res) => {
  try {
    if (!req.is('application/json')) {
      return res.status(400).json({ 
        error: "Content-Type must be application/json",
        response: "Invalid request format."
      });
    }
    
    const { message, conversationHistory = [] } = req.body;
    
    const apiKey = process.env.MOSLEM_BOT_API_KEY;
    const userId = process.env.MOSLEM_BOT_USER_ID;
    
    if (!apiKey || !userId) {
      console.error("Missing required environment variables");
      return res.status(500).json({ 
        error: "Server configuration error",
        response: "The Islamic bot service is not properly configured. Please contact the administrator."
      });
    }
    
    const conversationHistoryString = conversationHistory.length > 0
      ? `[${conversationHistory.map(([q, a]) => `["${q.replace(/"/g, '\\"')}", "${a.replace(/"/g, '\\"')}"]`).join(', ')}]`
      : "[]";
    
    const requestBody = {
      data: [
        message,
        2048,
        0.7,
        0.95,
        conversationHistoryString,
      ],
    };
    
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
    
    if (!data || !data.response || typeof data.response !== 'string') {
      console.error("Invalid API response structure:", data);
      return res.status(500).json({
        error: "Invalid response from API",
        response: "I apologize, but I received an invalid response. Please try again."
      });
    }
    
    res.json({ response: data.response });
  } catch (error) {
    console.error("Error calling Moslem Bot API:", error);
    res.status(500).json({ 
      error: "Failed to get response from Islamic bot",
      response: "I apologize, but I'm having trouble connecting. Please try again."
    });
  }
});

export default app;
