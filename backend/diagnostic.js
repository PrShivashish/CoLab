import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const key = process.env.GEMINI_API_KEY;
console.log("API Key present:", !!key);
console.log("API Key first/last 4:", key ? `${key.slice(0, 4)}...${key.slice(-4)}` : 'NONE');

const genAI = new GoogleGenerativeAI(key);

const models = [
    "gemini-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
];

async function testModel(modelName) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello in one word");
        console.log(`✅ ${modelName}: ${result.response.text().trim()}`);
        return true;
    } catch (err) {
        console.log(`❌ ${modelName}: [${err.status || err.code || 'ERR'}] ${err.message?.slice(0, 200)}`);
        return false;
    }
}

console.log("\n--- Testing models ---\n");
for (const m of models) {
    await testModel(m);
}
