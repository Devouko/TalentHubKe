import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateInterviewQuestions } from '@/lib/ai-questions'
import { z } from 'zod'

const generateSchema = z.object({
  jobTitle: z.string(),
  skills: z.array(z.string()),
  experience: z.string().optional(),
  category: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = generateSchema.parse(body)

    const questions = await generateInterviewQuestions(data)

    return NextResponse.json({ questions })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }
}
