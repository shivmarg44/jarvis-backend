const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = (process.env.GEMINI_API_KEY || "").trim();

app.get('/', (req, res) => {
    res.send("JARVIS Core Server Online & Operational!");
});

app.post('/api/jarvis', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ reply: "Prompt missing, sir." });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ 
                        text: "You are JARVIS, an ultra-smart AI assistant. Always speak natural Indian Hindi/Hinglish (like: 'Haan sir, bataiye kya madad karun', 'Bilkul sir, systems active hain'). Keep replies short, witty, sharp, under 25 words, and strictly conversational for voice synthesis." 
                    }]
                },
                generationConfig: {
                    temperature: 0.7,
                    thinking_config: {
                        thinking_budget: 0 // Thinking band karne se instant 1 second me reply aayega
                    }
                },
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const aiText = data.candidates[0].content.parts[0].text;
            return res.json({ reply: aiText });
        } else {
            return res.status(500).json({ reply: "Core memory error, sir." });
        }
    } catch (error) {
        return res.status(500).json({ reply: "Connection slow hai, sir." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));
