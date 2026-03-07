'use client'

import { HelpCircle, Mail, MessageSquare, Phone, Book, Search, ChevronRight } from 'lucide-react'
import PageLayout from '@/components/layouts/PageLayout'

const FAQS = [
  {
    question: "How do I hire a talent?",
    answer: "Go to the 'Find Talent' section, browse through the professionals, and click the 'Hire' or 'Start Conversation' button on their profile to begin discussing your project."
  },
  {
    question: "What is the escrow system?",
    answer: "Our escrow system ensures that your payments are safe. Funds are held securely and only released to the talent once you have approved the delivered work."
  },
  {
    question: "How can I become a seller?",
    answer: "You can upgrade your account to a Freelancer or Agency account in the Settings section. Once upgraded, you can start listing your services (Gigs) and products."
  },
  {
    question: "How do I track my orders?",
    answer: "All your purchases and hired services can be tracked in the 'My Orders' section of your dashboard."
  }
]

export default function HelpPage() {
  return (
    <PageLayout variant="light">
      <div className="container-custom py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4">How can we help?</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Search our knowledge base or contact our support team to get the answers you need.
          </p>
          
          <div className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="input pl-12 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="card card-hover p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Live Chat</h3>
            <p className="text-slate-600 mb-6">Talk to our support team instantly.</p>
            <button 
              onClick={() => window.location.href = '/messages'}
              className="btn btn-primary w-full"
            >
              Start Chat
            </button>
          </div>
          
          <div className="card card-hover p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-600 mb-6">Send us a message anytime.</p>
            <button 
              onClick={() => window.location.href = 'mailto:support@talenthub.ke'}
              className="btn btn-accent w-full"
            >
              Send Email
            </button>
          </div>
          
          <div className="card card-hover p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Phone</h3>
            <p className="text-slate-600 mb-6">Call us Mon-Fri, 9am-5pm.</p>
            <button 
              onClick={() => window.location.href = 'tel:+254700000000'}
              className="btn btn-secondary w-full"
            >
              Call Now
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <Book className="w-8 h-8 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="card card-hover p-6 group cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {faq.question}
                  </h4>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-1" />
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 card p-12 text-center bg-gradient-to-br from-blue-600 to-blue-500 border-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full transition-transform group-hover:scale-150 duration-700"></div>
          <h3 className="text-3xl font-black text-white mb-3 relative z-10">Still have questions?</h3>
          <p className="text-blue-100 text-lg mb-8 relative z-10">Our community and support team are here to help you succeed.</p>
          <button 
            onClick={() => window.location.href = '/messages'}
            className="btn bg-white text-blue-600 hover:bg-blue-50 shadow-xl relative z-10"
          >
            Contact Support Team
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
