'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SellerPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    deliveryTime: '',
    tags: '',
    images: []
  });

  const categories = [
    'Web Development', 'Mobile Apps', 'UI/UX Design', 'Digital Marketing',
    'Content Writing', 'SEO Services', 'Social Media', 'Video Editing'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          deliveryTime: parseInt(formData.deliveryTime),
          tags: formData.tags.split(',').map(tag => tag.trim()),
          sellerId: session?.user?.id
        })
      });

      if (response.ok) {
        router.push('/products');
      }
    } catch (error) {
      console.error('Error creating gig:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
  };

  return (
    <div style={{ backgroundColor: 'var(--primary)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '2rem' }}>
          Create New Digital Product
        </h1>

        <form onSubmit={handleSubmit} className="glass-card" style={{ 
          padding: '2rem', 
          borderRadius: '16px'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Product Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="glass"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="glass"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                resize: 'vertical',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="glass"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div>
              <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                Delivery Time (days)
              </label>
              <input
                type="number"
                value={formData.deliveryTime}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                className="glass"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="glass"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat} style={{ backgroundColor: 'var(--neutral)' }}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g. react, javascript, frontend"
              className="glass"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--primary)',
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}