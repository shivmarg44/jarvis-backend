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
            return res.json({ reply: "कुछ कहिए विशाल सर।" });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `You are JARVIS, personal AI assistant of Vishal sir (your boss and creator). Always address him respectfully as Vishal Sir or Sir. Speak in natural Indian Hindi (Devanagari script). Keep replies witty, smart, polite, and strictly under 20 words. User message: ${prompt}` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const aiText = data.candidates[0].content.parts[0].text;
            return res.json({ reply: aiText.trim() });
        } else {
            console.error("Gemini Error / Quota:", JSON.stringify(data));
            return res.json({ reply: "माफ़ कीजिये विशाल सर, न्यूरल लिंक में थोड़ा लैग है। एक बार फिर कहें।" });
        }
    } catch (error) {
        console.error("Server Link Error:", error);
        return res.json({ reply: "विशाल सर, नेटवर्क थोड़ा धीमा है।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));
