/**
 * Onboarding Step 1 Component
 * 
 * First step of user onboarding flow where users select their role:
 * - Client (wants to hire talent)
 * - Freelancer (wants to find work)
 * 
 * Features:
 * - Kenya-specific branding and messaging
 * - M-Pesa payment integration highlights
 * - Local benefits and features
 * - Progress indicator
 */

'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Briefcase, Code } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'

/**
 * User type selection options
 */
type UserType = 'client' | 'freelancer' | null

/**
 * OnboardingStep1 Component
 * 
 * Renders the first onboarding step with user type selection
 * and Kenya-specific benefits highlighting.
 */
export default function OnboardingStep1() {
  const [selectedType, setSelectedType] = useState<UserType>(null)

  /**
   * Handle user type selection
   */
  const selectClient = () => setSelectedType('client')
  const selectFreelancer = () => setSelectedType('freelancer')

  /**
   * Proceed to next onboarding step
   */
  const nextStep = () => {
    if (selectedType) {
      // Navigate to next step or save selection
      console.log('Selected type:', selectedType)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
              TalentHub 🇰🇪 KE
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Step 1 of 8
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Karibu to TalentHub Kenya! 🇰🇪
            </h1>
            <p className="text-xl text-muted-foreground">
              Africa's premier marketplace connecting talent with opportunity
            </p>
          </motion.div>

          {/* Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Client Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedType === 'client' 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={selectClient}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">👔</div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    I want to hire talent
                  </h3>
                  <div className="text-muted-foreground mb-6 space-y-2">
                    <p>Find skilled freelancers for your projects</p>
                    <p>• Post jobs & manage work</p>
                    <p>• Pay securely with M-Pesa</p>
                  </div>
                  <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                    For businesses & individuals
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Freelancer Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedType === 'freelancer' 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={selectFreelancer}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    I want to find work
                  </h3>
                  <div className="text-muted-foreground mb-6 space-y-2">
                    <p>Showcase your skills & get hired</p>
                    <p>• Browse projects & gigs</p>
                    <p>• Get paid directly to M-Pesa</p>
                  </div>
                  <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                    For freelancers & agencies
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Kenyan Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-8"
          >
            <h3 className="text-xl font-bold mb-6 text-center text-foreground">
              Why Choose TalentHub Kenya?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'No upfront fees - Pay only when you hire',
                'M-Pesa integration for instant payments',
                'KES-denominated contracts',
                'Local support in Swahili/English'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border p-6">
        <div className="max-w-4xl mx-auto flex justify-between">
          <Button variant="outline">
            Skip for now
          </Button>
          <Button 
            onClick={nextStep}
            disabled={!selectedType}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue
          </Button>
        </div>
      </footer>
    </div>
  )
}