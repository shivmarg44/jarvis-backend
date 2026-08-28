const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route (Browser check ke liye)
app.get('/', (req, res) => {
    res.send("JARVIS Core Server Online & Operational!");
});

const apiKey = process.env.GEMINI_API_KEY || "YOUR_API_KEY";
const genAI = new GoogleGenerativeAI(apiKey);

// Main Jarvis API endpoint
app.post('/api/jarvis', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ reply: "Prompt missing, sir." });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are JARVIS, Tony Stark's personal AI assistant. Keep responses brief, witty, sharp, respectful, and voice-ready."
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.json({ reply: text });
    } catch (error) {
        console.error("Jarvis Error:", error);
        return res.status(500).json({ reply: "Core link communication failure, sir." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));
