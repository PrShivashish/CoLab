import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Test what properties error objects have
async function testError(modelName) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hi");
        console.log(`✅ ${modelName}: ${result.response.text().slice(0, 50)}`);
    } catch (err) {
        console.log(`\n❌ ${modelName} error inspection:`);
        console.log("  typeof err:", typeof err);
        console.log("  err.constructor.name:", err?.constructor?.name);
        console.log("  err.message:", err?.message?.slice(0, 150));
        console.log("  err.status:", err?.status);
        console.log("  err.statusCode:", err?.statusCode);
        console.log("  err.code:", err?.code);
        console.log("  err.httpErrorCode:", err?.httpErrorCode);
        console.log("  err.response?.status:", err?.response?.status);
        console.log("  Object.keys(err):", Object.keys(err || {}));
        // Stringify to see all fields
        try {
            const s = JSON.stringify(err, Object.getOwnPropertyNames(err));
            console.log("  Full JSON:", s.slice(0, 500));
        } catch { }
    }
}

await testError("gemini-pro");       // Should get 404/403
await testError("gemini-2.5-flash"); // Should work
