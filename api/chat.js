export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: "Message is required",
        response: "Please provide a message."
      });
    }
    
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
    
    console.log("Calling Moslem Bot API...");
    
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
      return res.status(500).json({
        error: `API request failed with status ${response.status}`,
        response: "I apologize, but there was an error processing your question. Please try again."
      });
    }

    const data = await response.json();
    console.log("API Response received:", data);
    
    if (!data || !data.response || typeof data.response !== 'string') {
      console.error("Invalid API response structure:", data);
      return res.status(500).json({
        error: "Invalid response from API",
        response: "I apologize, but I received an invalid response. Please try again."
      });
    }
    
    return res.status(200).json({ response: data.response });
  } catch (error) {
    console.error("Error in chat handler:", error);
    return res.status(500).json({ 
      error: error.message || "Internal server error",
      response: "I apologize, but I'm having trouble connecting. Please try again."
    });
  }
}
