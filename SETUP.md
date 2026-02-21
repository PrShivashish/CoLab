# CoLab SaaS Setup Guide

## Quick Start

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **No API key needed!** 
   - CoLab now uses **Piston API** which is completely FREE
   - No registration, no API keys, no limits!
   - Public instance: https://emkc.org/api/v2/piston

3. **Start backend server:**
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser: http://localhost:5173**

## Testing the Platform

### Test Code Execution

**Python:**
```python
print("Hello from CoLab!")
for i in range(5):
    print(f"Count: {i}")
```

**JavaScript:**
```javascript
console.log("Hello from CoLab!");
const numbers = [1, 2, 3, 4, 5];
numbers.forEach(n => console.log(n * 2));
```

**Java:**
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from CoLab!");
        for(int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}
```

### Test Collaboration

1. **Create a room** at http://localhost:5173
2. **Copy the Room ID**
3. **Open new browser tab/window**
4. **Join with the Room ID**
5. **Start coding** - changes sync in real-time!

### Test Themes

- Click the theme toggle button (Moon/Zap icon) in the toolbar
- Switch between **Sleek Modern** (purple, elegant) and **Energetic Tech** (neon, cyberpunk)

## Features Implemented

✅ **Multi-Language Code Execution** (13 languages)
- Python, JavaScript, Java, C++, C, Go, TypeScript, Rust, Ruby, PHP, Kotlin, Swift, C#

✅ **Monaco Editor** (VS Code engine)
- Syntax highlighting
- Auto-completion
- Code formatting
- Minimap
- Line numbers

✅ **Real-Time Collaboration**
- Live code synchronization
- User presence indicators
- Instant updates across all collaborators

✅ **Dual Theme System**
- Sleek Modern: Dark, elegant, purple accents
- Energetic Tech: Cyberpunk, neon colors, glow effects

✅ **Professional Landing Page**
- Gradient hero section
- Feature showcase
- Smooth animations
- Call-to-action

✅ **Output Panel**
- Tabbed interface (Output / Terminal / Collaborators)
- Execution status
- Error messages
- Loading states

## Troubleshooting

**Issue: Code execution not working**
- Check backend console for error messages
- Verify backend is running on port 3000
- Make sure Piston API is accessible (public internet required)

**Issue: "Execution failed"**
- Try simpler code first (e.g., `print("Hello")`)
- Check for syntax errors in your code
- Verify the language is selected correctly

**Issue: Frontend won't start**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Make sure you're using Node.js v16+

## Next Steps

1. **Test code execution** with sample code (no API key needed!)
2. **Try all languages** - Python, JavaScript, Java, C++, etc.
3. **Invite teammates** to collaborate!

## Support

For issues or questions, check:
- Backend logs: Look for error messages in terminal
- Browser console: Press F12 to see frontend errors
- Piston documentation: https://github.com/engineer-man/piston

---

**Built with ❤️ for developers**
