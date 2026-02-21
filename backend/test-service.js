import 'dotenv/config';
import geminiService from './services/geminiService.js';

console.log("Testing geminiService.generateCode...\n");

try {
    const result = await geminiService.generateCode(
        "Create a polymorphism example",
        "javascript"
    );
    console.log("✅ SUCCESS:");
    console.log("Code:", result.code?.slice(0, 200));
    console.log("Explanation:", result.explanation);
} catch (err) {
    console.error("❌ FAILED:");
    console.error("Message:", err.message);
    console.error("Status:", err.status ?? err.statusCode ?? err.code);
    console.error("Full error:", JSON.stringify(err, null, 2));
}
