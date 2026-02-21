import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
console.log(`Using API Key: ${API_KEY ? 'Present' : 'MISSING'}`);

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro"
];

async function testModel(modelName) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Testing model: ${modelName}`);
    console.log(`--------------------------------------------------`);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
        const result = await model.generateContent("Hello");
        const response = result.response;
        console.log(`✅ SUCCESS with ${modelName}`);
        return true;
    } catch (error) {
        console.log(`❌ FAILED with ${modelName}`);

        // Log the full error object depth
        console.log("Error Name:", error.name);
        console.log("Error Message:", error.message);

        if (error.response) {
            console.log("HTTP Status:", error.response.status, error.response.statusText);
        }

        // Try to verify if it is a location issue
        if (error.message.includes("location is not supported")) {
            console.log("⚠️  ROOT CAUSE CHECK: User location is not supported.");
        }

        return false;
    }
}

async function runTests() {
    for (const modelName of modelsToTest) {
        await testModel(modelName);
    }
}

runTests();
