'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AIQuestionGeneratorProps {
  jobTitle: string
  skills: string[]
  category: string
  onQuestionsGenerated: (questions: string[]) => void
}

export function AIQuestionGenerator({ 
  jobTitle, 
  skills, 
  category, 
  onQuestionsGenerated 
}: AIQuestionGeneratorProps) {
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, skills, category }),
      })

      if (!res.ok) throw new Error('Failed to generate')

      const data = await res.json()
      onQuestionsGenerated(data.questions)
      toast.success('AI questions generated!')
    } catch (error) {
      toast.error('Failed to generate questions')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
    >
      {generating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Generate AI Questions
        </>
      )}
    </button>
  )
}
