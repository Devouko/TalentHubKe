# AI Interview Question Generator

## ✅ Implemented

### Backend
1. **AI Service** (`src/lib/ai-questions.ts`)
   - OpenAI integration (if API key provided)
   - Hugging Face fallback
   - Template-based fallback (always works)

2. **API Route** (`/api/ai/generate-questions`)
   - POST endpoint
   - Authenticated
   - Zod validation

### Frontend
3. **AI Generator Component** (`src/components/AIQuestionGenerator.tsx`)
   - Button with loading state
   - Toast notifications
   - Sparkles icon

4. **Integration** (`src/components/InterviewCriteria.tsx`)
   - AI button added to interview setup
   - Auto-populates questions

## 🚀 Usage

### Setup (Optional - for better AI)

Add to `.env.local`:
```env
# Option 1: OpenAI (best quality)
OPENAI_API_KEY=sk-...

# Option 2: Hugging Face (free)
HUGGINGFACE_API_KEY=hf_...

# Option 3: No key needed - uses templates
```

### How It Works

1. **With API Key**: Uses OpenAI/Hugging Face for smart questions
2. **Without API Key**: Uses intelligent templates (works offline)

### In Interview Setup

1. Click "Interview Setup" on any gig
2. Click "Generate AI Questions" button
3. Questions auto-populate based on:
   - Job title
   - Required skills
   - Category

### Example Generated Questions

For "Web Developer" with skills ["React", "Node.js"]:

```
1. What is your experience with React?
2. Can you describe a challenging project you worked on using Node.js?
3. How do you stay updated with the latest trends in web development?
4. Tell me about a time when you had to meet a tight deadline.
5. Rate your proficiency in React and provide an example.
```

## 🎯 Features

- ✅ **Smart Generation** - Context-aware questions
- ✅ **Multiple Providers** - OpenAI, Hugging Face, Templates
- ✅ **Always Works** - Template fallback ensures functionality
- ✅ **One Click** - Instant question generation
- ✅ **Customizable** - Edit generated questions
- ✅ **Free Option** - Works without API keys

## 📝 API Endpoint

```typescript
POST /api/ai/generate-questions

Body:
{
  "jobTitle": "Web Developer",
  "skills": ["React", "Node.js"],
  "category": "Programming",
  "experience": "2+ years" // optional
}

Response:
{
  "questions": [
    "What is your experience with React?",
    "Can you describe a project using Node.js?",
    ...
  ]
}
```

## 🔧 Customization

Edit `src/lib/ai-questions.ts` to:
- Change question templates
- Adjust AI prompts
- Add more question types
- Modify difficulty levels

## 💡 Tips

1. **Better Results**: Add OpenAI key for context-aware questions
2. **Free Usage**: Works perfectly without any API keys
3. **Edit Questions**: Always review and customize generated questions
4. **Skill-Based**: More skills = more relevant questions

---

**Status**: ✅ Fully Functional - Works with or without API keys!
