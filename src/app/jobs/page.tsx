'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposal, setProposal] = useState({ title: '', description: '', budget: '', timeline: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/gigs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setProposal({ 
      title: `Application for ${job.title}`, 
      description: '', 
      budget: job.price.toString(), 
      timeline: job.deliveryTime.toString() 
    });
    setShowModal(true);
  };

  const submitProposal = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedJob.id,
          ...proposal
        })
      });
      
      if (response.ok) {
        setShowModal(false);
        setProposal({ title: '', description: '', budget: '', timeline: '' });
        alert('Application submitted successfully!');
      } else {
        alert('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: 'var(--primary)', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Loading jobs...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--primary)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '2rem' }}>
          Available Jobs & Gigs
        </h1>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {jobs.map(job => (
            <div
              key={job.id}
              className="glass-card"
              style={{
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '1.2rem', 
                  marginBottom: '0.5rem',
                  fontWeight: 'bold'
                }}>
                  {job.title}
                </h3>
                
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem', 
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {job.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ 
                  color: 'var(--secondary)', 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold' 
                }}>
                  ${job.price}
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    ⭐ {job.rating || 0}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    ({job.reviewCount || 0})
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    backgroundColor: 'var(--accent)', 
                    color: 'var(--primary)', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {job.category}
                  </span>
                  
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    🚚 {job.deliveryTime} days
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  By: {job.seller?.name || 'Unknown Seller'}
                </span>
              </div>

              {job.tags && job.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {job.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: 'var(--neutral)',
                        color: 'var(--text-secondary)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.7rem'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleApply(job)}
                disabled={!session}
                style={{
                  width: '100%',
                  backgroundColor: session ? 'var(--secondary)' : 'var(--neutral)',
                  color: 'var(--primary)',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: session ? 'pointer' : 'not-allowed'
                }}
              >
                {session ? 'Apply to Job' : 'Login to Apply'}
              </button>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-secondary)', 
            fontSize: '1.1rem', 
            marginTop: '3rem' 
          }}>
            No jobs available at the moment.
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            padding: '2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            border: '1px solid var(--neutral)'
          }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Apply to Job</h2>
            <form onSubmit={submitProposal}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Title</label>
                <input
                  type="text"
                  value={proposal.title}
                  onChange={(e) => setProposal({...proposal, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral)',
                    backgroundColor: 'var(--neutral)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  value={proposal.description}
                  onChange={(e) => setProposal({...proposal, description: e.target.value})}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral)',
                    backgroundColor: 'var(--neutral)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Budget ($)</label>
                  <input
                    type="number"
                    value={proposal.budget}
                    onChange={(e) => setProposal({...proposal, budget: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--neutral)',
                      backgroundColor: 'var(--neutral)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Timeline (days)</label>
                  <input
                    type="number"
                    value={proposal.timeline}
                    onChange={(e) => setProposal({...proposal, timeline: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--neutral)',
                      backgroundColor: 'var(--neutral)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--primary)',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}