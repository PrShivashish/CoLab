import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

async function test() {
    try {
        console.log('Testing Gemini API...');
        console.log('API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

        const prompt = "Say 'Hello World' in JavaScript";
        console.log('Sending request...');

        const result = await model.generateContent(prompt);
        console.log('Success! Response:', result.response.text());
    } catch (error) {
        console.error('ERROR:', error);
        console.error('Error details:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
    }
}

test();
