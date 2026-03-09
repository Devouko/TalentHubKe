'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Briefcase, DollarSign, FileText, TrendingUp, 
  Clock, CheckCircle, XCircle, Eye, Search,
  Plus, ArrowUpRight, Calendar, Star
} from 'lucide-react'
import { toast } from 'sonner'

interface FreelancerStats {
  totalEarnings: number
  pendingEarnings: number
  activeContracts: number
  completedProjects: number
  pendingProposals: number
  profileViews: number
  rating: number
  successRate: number
}

interface Contract {
  id: string
  title: string
  client: string
  amount: number
  status: string
  deadline: string
  progress: number
}

interface Proposal {
  id: string
  jobTitle: string
  bidAmount: number
  status: string
  submittedAt: string
}

export default function FreelancerDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<FreelancerStats>({
    totalEarnings: 0,
    pendingEarnings: 0,
    activeContracts: 0,
    completedProjects: 0,
    pendingProposals: 0,
    profileViews: 0,
    rating: 0,
    successRate: 0
  })
  const [contracts, setContracts] = useState<Contract[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])

  useEffect(() => {
    if (!session) {
      router.push('/auth')
      return
    }
    
    fetchFreelancerData()
  }, [session, router])

  const fetchFreelancerData = async () => {
    try {
      // Fetch freelancer stats, contracts, and proposals
      // For now, using mock data until APIs are created
      
      setStats({
        totalEarnings: 125000,
        pendingEarnings: 35000,
        activeContracts: 3,
        completedProjects: 12,
        pendingProposals: 5,
        profileViews: 234,
        rating: 4.8,
        successRate: 95
      })

      setContracts([
        {
          id: '1',
          title: 'E-commerce Website Development',
          client: 'Tech Solutions Ltd',
          amount: 50000,
          status: 'active',
          deadline: '2026-04-15',
          progress: 65
        },
        {
          id: '2',
          title: 'Mobile App UI/UX Design',
          client: 'StartupCo',
          amount: 30000,
          status: 'active',
          deadline: '2026-03-25',
          progress: 40
        }
      ])

      setProposals([
        {
          id: '1',
          jobTitle: 'WordPress Website Redesign',
          bidAmount: 45000,
          status: 'pending',
          submittedAt: '2026-03-05'
        },
        {
          id: '2',
          jobTitle: 'React Dashboard Development',
          bidAmount: 60000,
          status: 'pending',
          submittedAt: '2026-03-06'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch freelancer data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">
            Freelancer <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Welcome back, <span className="font-bold text-slate-900 dark:text-white">{session?.user?.name}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto">
          {['Overview', 'Find Work', 'Proposals', 'Contracts', 'Earnings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.toLowerCase().replace(' ', '-')
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Total Earnings', 
                  value: `KES ${stats.totalEarnings.toLocaleString()}`, 
                  icon: DollarSign, 
                  color: 'emerald',
                  change: '+12%'
                },
                { 
                  label: 'Active Contracts', 
                  value: stats.activeContracts, 
                  icon: Briefcase, 
                  color: 'blue',
                  change: '+2'
                },
                { 
                  label: 'Pending Proposals', 
                  value: stats.pendingProposals, 
                  icon: FileText, 
                  color: 'orange',
                  change: '5 waiting'
                },
                { 
                  label: 'Success Rate', 
                  value: `${stats.successRate}%`, 
                  icon: TrendingUp, 
                  color: 'purple',
                  change: '+3%'
                }
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{stat.change}</span>
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Active Contracts */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Active Contracts</h2>
                <Link href="/contracts" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {contracts.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No active contracts</p>
                    <Link href="/find-work" className="text-blue-600 text-sm font-semibold mt-2 inline-block">
                      Find Work
                    </Link>
                  </div>
                ) : (
                  contracts.map((contract) => (
                    <div key={contract.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-blue-500 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{contract.title}</h3>
                          <p className="text-sm text-slate-500">{contract.client}</p>
                        </div>
                        <span className="text-lg font-black text-blue-600">
                          KES {contract.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-bold text-slate-900 dark:text-white">{contract.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${contract.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm mt-3">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(contract.deadline).toLocaleDateString()}
                          </span>
                          <Link 
                            href={`/contracts/${contract.id}`}
                            className="text-blue-600 font-semibold hover:text-blue-700"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Proposals */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Recent Proposals</h2>
                <Link href="/proposals" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{proposal.jobTitle}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Bid: KES {proposal.bidAmount.toLocaleString()} • Submitted {new Date(proposal.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        proposal.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        proposal.status === 'accepted' ? 'bg-green-100 text-green-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Find Work Tab */}
        {activeTab === 'find-work' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 text-center">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Find Work</h2>
            <p className="text-slate-500 mb-6">Browse available jobs and submit proposals</p>
            <Link 
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Other tabs - Coming soon */}
        {['proposals', 'contracts', 'earnings'].includes(activeTab) && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Coming Soon</h2>
            <p className="text-slate-500">This feature is under development</p>
          </div>
        )}
      </div>
    </div>
  )
}
