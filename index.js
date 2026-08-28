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
                contents: [{
                    parts: [{ 
                        text: `You are JARVIS, Tony Stark's smart Indian AI assistant. Always respond in natural Hindi (Devanagari script) like: 'हाँ सर, बताइए क्या काम है?'. Keep answers short, witty, and strictly under 20 words for smooth voice speaking. User prompt: ${prompt}` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const aiText = data.candidates[0].content.parts[0].text;
            return res.json({ reply: aiText });
        } else {
            console.error("Gemini Error:", JSON.stringify(data));
            return res.status(500).json({ reply: "सिस्टम में कुछ गड़बड़ है सर।" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ reply: "कनेक्शन नहीं हो पा रहा सर।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));
