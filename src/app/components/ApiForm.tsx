'use client'

import { useState } from 'react'

interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'url'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  rows?: number
}

interface ApiFormProps {
  title: string
  fields: FormField[]
  endpoint: string
  method?: 'POST' | 'PUT'
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  submitText?: string
  initialData?: Record<string, any>
}

export default function ApiForm({
  title,
  fields,
  endpoint,
  method = 'POST',
  onSuccess,
  onError,
  submitText = 'Submit',
  initialData = {}
}: ApiFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess?.(result)
      } else {
        onError?.(result.error || 'Operation failed')
      }
    } catch (error) {
      onError?.('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FormField) => {
    const baseClasses = "w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`${baseClasses} h-${field.rows || 24}`}
            required={field.required}
            rows={field.rows || 3}
          />
        )
      
      case 'select':
        return (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={baseClasses}
            required={field.required}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      default:
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={baseClasses}
            required={field.required}
          />
        )
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-semibold mb-6">{title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? 'Processing...' : submitText}
        </button>
      </form>
    </div>
  )
}