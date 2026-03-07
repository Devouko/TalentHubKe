// Using OpenAI API (or fallback to local generation)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface GenerateQuestionsParams {
  jobTitle: string
  skills: string[]
  experience?: string
  category: string
}

export async function generateInterviewQuestions(params: GenerateQuestionsParams) {
  const { jobTitle, skills, experience, category } = params

  // If OpenAI key is available, use it
  if (OPENAI_API_KEY) {
    return await generateWithOpenAI(params)
  }

  // Fallback to template-based generation
  return generateTemplateQuestions(params)
}

async function generateWithOpenAI(params: GenerateQuestionsParams) {
  const { jobTitle, skills, experience, category } = params

  const prompt = `Generate 5 professional interview questions for a ${jobTitle} position in ${category}.
Required skills: ${skills.join(', ')}
${experience ? `Experience level: ${experience}` : ''}

Return ONLY a JSON array of questions, each with:
- question: string
- type: "technical" | "behavioral" | "situational"
- difficulty: "easy" | "medium" | "hard"

Example format:
[
  {
    "question": "Describe your experience with...",
    "type": "technical",
    "difficulty": "medium"
  }
]`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert HR interviewer. Generate relevant, professional interview questions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    const content = data.choices[0].message.content
    
    // Parse JSON from response
    const questions = JSON.parse(content)
    return questions.map((q: any) => q.question)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateTemplateQuestions(params)
  }
}

function generateTemplateQuestions(params: GenerateQuestionsParams): string[] {
  const { jobTitle, skills, experience, category } = params

  const templates = {
    technical: [
      `What is your experience with ${skills[0] || 'the required technologies'}?`,
      `Can you describe a challenging project you worked on using ${skills[1] || 'these skills'}?`,
      `How do you stay updated with the latest trends in ${category}?`,
    ],
    behavioral: [
      `Tell me about a time when you had to meet a tight deadline for a ${jobTitle} project.`,
      `How do you handle feedback and criticism on your work?`,
      `Describe a situation where you had to work with a difficult client or team member.`,
    ],
    situational: [
      `If a client requests changes outside the project scope, how would you handle it?`,
      `How would you approach a project with unclear requirements?`,
      `What would you do if you realized you couldn't meet a deadline?`,
    ],
  }

  // Mix questions from different categories
  const questions = [
    ...templates.technical.slice(0, 2),
    ...templates.behavioral.slice(0, 2),
    ...templates.situational.slice(0, 1),
  ]

  // Add skill-specific questions
  skills.slice(0, 2).forEach(skill => {
    questions.push(`Rate your proficiency in ${skill} and provide an example of how you've used it.`)
  })

  return questions.slice(0, 5)
}

// Alternative: Use free Hugging Face API
async function generateWithHuggingFace(params: GenerateQuestionsParams) {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
  if (!HF_API_KEY) return generateTemplateQuestions(params)

  const { jobTitle, skills, category } = params

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/flan-t5-large',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Generate 5 interview questions for ${jobTitle} with skills: ${skills.join(', ')}`,
        }),
      }
    )

    const data = await response.json()
    // Parse and format response
    return data[0]?.generated_text?.split('\n').filter(Boolean).slice(0, 5) || generateTemplateQuestions(params)
  } catch (error) {
    return generateTemplateQuestions(params)
  }
}
