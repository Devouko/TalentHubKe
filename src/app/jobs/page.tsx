'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
                style={{
                  width: '100%',
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--primary)',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                View Details
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
    </div>
  );
}