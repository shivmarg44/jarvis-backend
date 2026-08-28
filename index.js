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
            return res.json({ reply: "कुछ कहिए सर।" });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `You are JARVIS, an intelligent Indian AI assistant. Reply in natural Hindi (Devanagari script). Be witty, smart, and polite. If the user tells you their name, acknowledge and remember it. If they ask for their name without telling you first, politely ask what they would like to be called. Keep replies under 20 words. User message: ${prompt}` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const aiText = data.candidates[0].content.parts[0].text;
            return res.json({ reply: aiText.trim() });
        } else {
            return res.json({ reply: "माफ़ कीजिये सर, एक बार फिर बोलें।" });
        }
    } catch (error) {
        return res.json({ reply: "सिस्टम कनेक्शन धीमा है सर।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));
