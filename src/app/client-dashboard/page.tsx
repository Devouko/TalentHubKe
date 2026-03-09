'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Briefcase, Users, FileText, DollarSign, 
  MessageCircle, Plus, TrendingUp, Clock,
  CheckCircle, AlertCircle, Eye, Search
} from 'lucide-react'
import { toast } from 'sonner'

interface ClientStats {
  activeJobs: number
  totalSpent: number
  proposalsReceived: number
  activeContracts: number
  completedProjects: number
  totalHires: number
}

interface Job {
  id: string
  title: string
  budget: number
  proposals: number
  status: string
  createdAt: string
  deadline?: string
}

interface Proposal {
  id: string
  jobId: string
  jobTitle: string
  freelancerName: string
  bidAmount: number
  deliveryTime: number
  status: string
  submittedAt: string
}

interface Contract {
  id: string
  title: string
  freelancer: string
  amount: number
  status: string
  progress: number
  deadline: string
}

export default function ClientDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ClientStats>({
    activeJobs: 0,
    totalSpent: 0,
    proposalsReceived: 0,
    activeContracts: 0,
    completedProjects: 0,
    totalHires: 0
  })
  const [jobs, setJobs] = useState<Job[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    if (!session) {
      router.push('/auth')
      return
    }
    fetchDashboardData()
  }, [session, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch jobs, proposals, and contracts in parallel
      const [jobsRes, proposalsRes, contractsRes] = await Promise.allSettled([
        fetch('/api/jobs?type=client'),
        fetch('/api/proposals?type=received'),
        fetch('/api/contracts?type=client')
      ])

      // Handle jobs
      if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
        const jobsData = await jobsRes.value.json()
        const jobsList = Array.isArray(jobsData) ? jobsData : (jobsData.jobs || [])
        setJobs(jobsList)
        
        // Calculate stats from jobs
        const activeJobs = jobsList.filter((j: Job) => j.status === 'open').length
        const totalProposals = jobsList.reduce((sum: number, j: Job) => sum + (j.proposals || 0), 0)
        
        setStats(prev => ({
          ...prev,
          activeJobs,
          proposalsReceived: totalProposals
        }))
      }

      // Handle proposals
      if (proposalsRes.status === 'fulfilled' && proposalsRes.value.ok) {
        const proposalsData = await proposalsRes.value.json()
        setProposals(Array.isArray(proposalsData) ? proposalsData : (proposalsData.proposals || []))
      }

      // Handle contracts
      if (contractsRes.status === 'fulfilled' && contractsRes.value.ok) {
        const contractsData = await contractsRes.value.json()
        const contractsList = Array.isArray(contractsData) ? contractsData : (contractsData.contracts || [])
        setContracts(contractsList)
        
        // Calculate contract stats
        const activeContracts = contractsList.filter((c: Contract) => c.status === 'active').length
        const completedProjects = contractsList.filter((c: Contract) => c.status === 'completed').length
        const totalSpent = contractsList.reduce((sum: number, c: Contract) => sum + c.amount, 0)
        
        setStats(prev => ({
          ...prev,
          activeContracts,
          completedProjects,
          totalSpent
        }))
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
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
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Client <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your projects, hire talent, and track progress
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex gap-4">
          <Link
            href="/jobs/create"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Post a Job
          </Link>
          <Link
            href="/all-talent"
            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold flex items-center gap-2 transition-all"
          >
            <Search className="w-5 h-5" />
            Browse Talent
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200 dark:border-slate-800">
          {['overview', 'jobs', 'proposals', 'contracts', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'blue' },
                { label: 'Proposals Received', value: stats.proposalsReceived, icon: FileText, color: 'purple' },
                { label: 'Active Contracts', value: stats.activeContracts, icon: Users, color: 'green' },
                { label: 'Completed Projects', value: stats.completedProjects, icon: CheckCircle, color: 'emerald' },
                { label: 'Total Spent', value: `KES ${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'orange' },
                { label: 'Total Hires', value: stats.totalHires, icon: TrendingUp, color: 'pink' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Jobs</h3>
                </div>
                <div className="p-6">
                  {jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No jobs posted yet</p>
                      <Link href="/jobs/create" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                        Post your first job
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {jobs.slice(0, 5).map((job) => (
                        <Link
                          key={job.id}
                          href={`/jobs/${job.id}`}
                          className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 dark:text-white">{job.title}</h4>
                              <p className="text-sm text-slate-500 mt-1">
                                {job.proposals} proposals • KES {job.budget.toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'open' ? 'bg-green-100 text-green-700' :
                              job.status === 'closed' ? 'bg-slate-100 text-slate-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Proposals */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Proposals</h3>
                </div>
                <div className="p-6">
                  {proposals.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No proposals yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {proposals.slice(0, 5).map((proposal) => (
                        <div
                          key={proposal.id}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 dark:text-white">{proposal.freelancerName}</h4>
                              <p className="text-sm text-slate-500 mt-1">
                                KES {proposal.bidAmount.toLocaleString()} • {proposal.deliveryTime} days
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {proposal.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-6">My Jobs</h2>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">You haven't posted any jobs yet</p>
                <Link
                  href="/jobs/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {job.proposals} proposals
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            KES {job.budget.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        job.status === 'open' ? 'bg-green-100 text-green-700' :
                        job.status === 'closed' ? 'bg-slate-100 text-slate-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/jobs/${job.id}/proposals`}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-all"
                      >
                        View Proposals ({job.proposals})
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Proposals Tab */}
        {activeTab === 'proposals' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-6">Proposals Received</h2>
            {proposals.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No proposals received yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{proposal.freelancerName}</h3>
                        <p className="text-sm text-slate-500 mt-1">Applied for: {proposal.jobTitle}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                          <span>Bid: KES {proposal.bidAmount.toLocaleString()}</span>
                          <span>Delivery: {proposal.deliveryTime} days</span>
                          <span>Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    {proposal.status === 'pending' && (
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all">
                          Accept Proposal
                        </button>
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-all">
                          View Profile
                        </button>
                        <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold transition-all">
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-6">Active Contracts</h2>
            {contracts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No active contracts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{contract.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">Freelancer: {contract.freelancer}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                          <span>Amount: KES {contract.amount.toLocaleString()}</span>
                          <span>Deadline: {new Date(contract.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        contract.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        contract.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{contract.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${contract.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        View Contract
                      </Link>
                      <Link
                        href={`/messages?user=${contract.freelancer}`}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Payment history will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
