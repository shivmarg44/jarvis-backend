const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("JARVIS Core Server Online & Operational!");
});

const API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";

app.post('/api/jarvis', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ reply: "Prompt missing, sir." });
        }

        // v1 stable endpoint
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are JARVIS, Tony Stark's personal AI assistant. Keep responses brief, witty, sharp, and voice-ready. User says: ${prompt}` }]
                }]
            })
        });

        const data = await response.json();
        console.log("Gemini API Response:", JSON.stringify(data));

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const aiText = data.candidates[0].content.parts[0].text;
            return res.json({ reply: aiText });
        } else {
            return res.status(500).json({ reply: data.error?.message || "Brain processing error, sir." });
        }
    } catch (error) {
        console.error("Jarvis Server Error:", error);
        return res.status(500).json({ reply: "Core link communication failure, sir." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));
