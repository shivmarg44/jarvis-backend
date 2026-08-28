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
            return res.status(400).json({ reply: "कुछ कहिए सर।" });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ 
                        text: "You are JARVIS, Tony Stark's smart Indian AI assistant. Always respond in pure Hindi (Devanagari script) like: 'नमस्ते सर, बताइए क्या काम है?' or 'बिल्कुल सर, सब तैयार है।' Keep answers short, smart, witty, and strictly under 20 words so voice engine speaks naturally." 
                    }]
                },
                generationConfig: {
                    thinking_config: {
                        thinking_budget: 0
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
            return res.status(500).json({ reply: "सिस्टम में कुछ गड़बड़ है सर।" });
        }
    } catch (error) {
        return res.status(500).json({ reply: "कनेक्शन नहीं हो पा रहा सर।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));
