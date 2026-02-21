
import 'dotenv/config';
import geminiService from './services/geminiService.js';

async function test() {
    console.log("Testing generateCode...");
    try {
        const result = await geminiService.generateCode("Write a small hello world in C++", "cpp");
        console.log("SUCCESS!");
        console.log("Code Preview:", result.code.slice(0, 50));
    } catch (err) {
        console.error("DIAGNOSTIC ERROR:", err);
        if (err.stack) console.error(err.stack);
    }
}

test();
