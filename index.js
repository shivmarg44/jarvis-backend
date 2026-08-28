const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Browser Test Route
app.get('/', (req, res) => {
    res.send("JARVIS Core Server Online & Operational!");
});

// Quick Browser Test API (Direct test karne ke liye)
app.get('/test', async (req, res) => {
    const key = (process.env.GEMINI_API_KEY || "").trim();
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const API_KEY = (process.env.GEMINI_API_KEY || "").trim();

app.post('/api/jarvis', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ reply: "Prompt missing, sir." });
        }

        // Gemini REST Call with v1 endpoint
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `You are JARVIS, Tony Stark's personal AI assistant. Reply briefly, sharply, and respectfully. Prompt: ${prompt}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const aiText = data.candidates[0].content.parts[0].text;
            return res.json({ reply: aiText });
        } else {
            console.error("Gemini API Error Detail:", JSON.stringify(data));
            return res.status(500).json({ reply: data.error?.message || "Brain processing error, sir." });
        }
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ reply: "Core link communication failure, sir." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));
