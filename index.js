const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");

app.post('/api/jarvis', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ reply: "Prompt parameter missing, sir." });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are JARVIS, an advanced AI inspired by Tony Stark's assistant. Keep answers brief, witty, sharp, respectful, and optimized for voice speech."
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const replyText = response.text() || "System could not generate a response, sir.";

        return res.json({ reply: replyText });
    } catch (error) {
        console.error("Jarvis Backend Error:", error);
        return res.status(500).json({ reply: "Core link communication failure, sir." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Jarvis relay live on port ${PORT}`));