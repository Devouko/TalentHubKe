'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import PageLayout from '@/components/layouts/PageLayout'

type UserType = 'client' | 'freelancer' | null

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<UserType>(null)
  const [loading, setLoading] = useState(false)

  const totalSteps = 3

  const handleNext = async () => {
    if (step === 1 && !selectedType) {
      toast.error('Please select an account type')
      return
    }

    if (step === totalSteps) {
      await completeOnboarding()
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: selectedType === 'client' ? 'CLIENT' : 'FREELANCER',
          onboardingCompleted: true
        })
      })

      if (response.ok) {
        await update()
        toast.success('Welcome to TalentHub!')
        router.push(selectedType === 'client' ? '/browse-gigs' : '/dashboard')
      } else {
        toast.error('Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-black mb-4 text-slate-900">
                Karibu to TalentHub Kenya! 🇰🇪
              </h1>
              <p className="text-xl text-slate-600">
                Africa's premier marketplace connecting talent with opportunity
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div 
                  className={`card card-hover p-8 cursor-pointer ${
                    selectedType === 'client' 
                      ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                      : ''
                  }`}
                  onClick={() => setSelectedType('client')}
                >
                  <div className="text-6xl mb-4 text-center">👔</div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900 text-center">
                    I want to hire talent
                  </h3>
                  <div className="text-slate-600 mb-6 space-y-2">
                    <p>Find skilled freelancers for your projects</p>
                    <p>• Post jobs & manage work</p>
                    <p>• Pay securely with M-Pesa</p>
                  </div>
                  <div className="badge badge-success mx-auto block w-fit">
                    For businesses & individuals
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div 
                  className={`card card-hover p-8 cursor-pointer ${
                    selectedType === 'freelancer' 
                      ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                      : ''
                  }`}
                  onClick={() => setSelectedType('freelancer')}
                >
                  <div className="text-6xl mb-4 text-center">💻</div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900 text-center">
                    I want to find work
                  </h3>
                  <div className="text-slate-600 mb-6 space-y-2">
                    <p>Showcase your skills & get hired</p>
                    <p>• Browse projects & gigs</p>
                    <p>• Get paid directly to M-Pesa</p>
                  </div>
                  <div className="badge badge-success mx-auto block w-fit">
                    For freelancers & agencies
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-black mb-8 text-center text-slate-900">
              {selectedType === 'client' ? 'How It Works for Clients' : 'How It Works for Freelancers'}
            </h2>
            
            {selectedType === 'client' ? (
              <div className="space-y-6">
                <div className="card card-hover p-6 flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-black">1</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 mb-2">Browse Talent</h3>
                    <p className="text-slate-600">Search through thousands of verified freelancers and agencies</p>
                  </div>
                </div>
                <div className="card card-hover p-6 flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-black">2</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 mb-2">Hire & Pay</h3>
                    <p className="text-slate-600">Hire talent and pay securely using M-Pesa or card</p>
                  </div>
                </div>
                <div className="card card-hover p-6 flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-black">3</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 mb-2">Get Results</h3>
                    <p className="text-slate-600">Receive quality work and release payment when satisfied</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="card card-hover p-6 flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-black">1</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 mb-2">Create Profile</h3>
                    <p className="text-slate-600">Showcase your skills, portfolio, and experience</p>
                  </div>
                </div>
                <div className="card card-hover p-6 flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-black">2</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 mb-2">Find Work</h3>
                    <p className="text-slate-600">Browse jobs and submit proposals to clients</p>
                  </div>
                </div>
                <div className="card card-hover p-6 flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-black">3</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 mb-2">Get Paid</h3>
                    <p className="text-slate-600">Complete work and receive payment directly to M-Pesa</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">You're All Set!</h2>
            <p className="text-xl text-slate-600 mb-8">
              Ready to {selectedType === 'client' ? 'find amazing talent' : 'start earning'}?
            </p>

            <div className="card p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Why Choose TalentHub Kenya?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  'No upfront fees',
                  'M-Pesa integration',
                  'Secure escrow system',
                  'Local support',
                  'Verified professionals',
                  'Quality guarantee'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-900 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <PageLayout variant="light">
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-slate-200 p-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
                TalentHub 🇰🇪 KE
              </span>
            </h1>
            <div className="text-sm text-slate-600 font-medium">
              Step {step} of {totalSteps}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${
                      s <= step ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {s < step ? <Check className="w-6 h-6" /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        s < step ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {renderStep()}
          </div>
        </main>

        <footer className="border-t border-slate-200 p-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto flex justify-between">
            <button 
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleNext}
              disabled={loading || (step === 1 && !selectedType)}
            >
              {loading ? 'Loading...' : step === totalSteps ? 'Get Started' : 'Continue'}
              {!loading && step < totalSteps && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </footer>
      </div>
    </PageLayout>
  )
}
