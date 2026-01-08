'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Star, Clock, ShoppingCart, Heart, Share2, 
  CheckCircle, ArrowLeft, ZoomIn, User, Award,
  MessageCircle, Shield, Truck
} from 'lucide-react'

// Mock gig data - in real app, fetch from API
const mockGig = {
  id: '1',
  title: 'Professional Logo Design with Brand Guidelines',
  seller: {
    name: 'Sarah Design',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
    rating: 4.9,
    reviews: 342,
    level: 'Top Rated Seller',
    responseTime: '1 hour',
    languages: ['English', 'Swahili']
  },
  price: 299,
  rating: 4.9,
  reviews: 342,
  images: [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
    'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800'
  ],
  description: `I will create a professional logo design that perfectly represents your brand identity. With over 5 years of experience in graphic design, I specialize in creating memorable and impactful logos for businesses of all sizes.

What you'll get:
• Custom logo design (3 initial concepts)
• High-resolution files (PNG, JPG, SVG, PDF)
• Brand color palette
• Typography guidelines
• Social media kit
• Unlimited revisions until you're 100% satisfied

My design process:
1. Brand discovery and research
2. Concept development
3. Design refinement
4. Final delivery with all files

I work with businesses across Kenya and globally, understanding local market preferences while maintaining international design standards.`,
  deliveryTime: 3,
  packages: [
    {
      name: 'Basic',
      price: 299,
      deliveryTime: 3,
      features: [
        '1 Logo concept',
        '3 Revisions',
        'High-resolution PNG & JPG',
        'Basic brand colors'
      ]
    },
    {
      name: 'Standard',
      price: 599,
      deliveryTime: 5,
      features: [
        '3 Logo concepts',
        '5 Revisions',
        'All file formats (PNG, JPG, SVG, PDF)',
        'Brand color palette',
        'Typography guide',
        'Social media kit'
      ]
    },
    {
      name: 'Premium',
      price: 999,
      deliveryTime: 7,
      features: [
        '5 Logo concepts',
        'Unlimited revisions',
        'All file formats + source files',
        'Complete brand guidelines',
        'Business card design',
        'Letterhead design',
        '24/7 support'
      ]
    }
  ],
  faqs: [
    {
      question: 'What if I don\'t like the initial concepts?',
      answer: 'No worries! I offer unlimited revisions until you\'re completely satisfied with the design.'
    },
    {
      question: 'Do you provide the source files?',
      answer: 'Yes, with the Premium package you get all source files including AI and PSD formats.'
    },
    {
      question: 'Can you work with my existing brand colors?',
      answer: 'Absolutely! I can work with your existing brand guidelines or create new ones.'
    }
  ]
}

export default function GigDetail() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState(1)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
                Back to marketplace
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative group">
                <img 
                  src={mockGig.images[selectedImage]} 
                  alt={mockGig.title}
                  className="w-full h-96 object-cover rounded-xl cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                />
                <button 
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {mockGig.images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === i ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title and Seller Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{mockGig.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    src={mockGig.seller.avatar} 
                    alt={mockGig.seller.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{mockGig.seller.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{mockGig.seller.rating}</span>
                      <span>({mockGig.seller.reviews} reviews)</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {mockGig.seller.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">About This Gig</h2>
              <div className="prose prose-invert max-w-none">
                {mockGig.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {mockGig.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-border pb-4 last:border-b-0">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing and Actions */}
          <div className="space-y-6">
            {/* Package Selection */}
            <div className="bg-card rounded-xl border border-border overflow-hidden sticky top-6">
              <div className="flex border-b border-border">
                {mockGig.packages.map((pkg, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPackage(i)}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      selectedPackage === i 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="text-2xl font-bold">${mockGig.packages[selectedPackage].price}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {mockGig.packages[selectedPackage].deliveryTime} days delivery
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {mockGig.packages[selectedPackage].features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90">
                    Continue (${mockGig.packages[selectedPackage].price})
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex-1 py-2 border rounded-lg flex items-center justify-center gap-2 ${
                        isLiked ? 'border-red-500 text-red-500' : 'border-border hover:bg-accent'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                      Save
                    </button>
                    <button className="flex-1 py-2 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={mockGig.seller.avatar} 
                  alt={mockGig.seller.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <div className="font-bold text-lg">{mockGig.seller.name}</div>
                  <div className="text-sm text-muted-foreground">{mockGig.seller.level}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Rating</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{mockGig.seller.rating}</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Response time</div>
                  <div className="font-semibold">{mockGig.seller.responseTime}</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-muted-foreground">Languages</div>
                <div className="flex gap-2">
                  {mockGig.seller.languages.map((lang, i) => (
                    <span key={i} className="px-2 py-1 bg-muted rounded text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full py-2 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={mockGig.images[selectedImage]} 
              alt={mockGig.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="flex justify-center gap-2 mt-4">
              {mockGig.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-3 h-3 rounded-full ${
                    selectedImage === i ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}