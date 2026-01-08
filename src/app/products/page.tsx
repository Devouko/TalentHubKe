'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShoppingCart, Star, Eye, Filter, Search, Package } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const categories = [
    'all', 'Electronics & Gadgets', 'Fashion & Clothing', 'Home & Garden', 
    'Health & Beauty', 'Sports & Fitness', 'Books & Media', 'Art & Crafts', 'Digital Products'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/gigs');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === 'all' || product.category === filter;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: 'var(--primary)', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--secondary)' }}></div>
          <div style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--primary)', minHeight: '100vh', paddingTop: '5rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ 
                color: 'var(--secondary)', 
                fontSize: '3rem', 
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                Product Marketplace
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Discover amazing products from talented sellers
              </p>
            </div>
            <button
              onClick={() => router.push('/create-product')}
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--primary)',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem'
              }}
            >
              <Package style={{ width: '1.25rem', height: '1.25rem' }} />
              Sell Product
            </button>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                color: 'var(--text-secondary)'
              }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  backgroundColor: 'var(--neutral)',
                  border: '1px solid rgba(127, 255, 0, 0.2)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--accent)',
                    borderRadius: '25px',
                    backgroundColor: filter === category ? 'var(--accent)' : 'transparent',
                    color: filter === category ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: '0.9rem',
                    fontWeight: filter === category ? 'bold' : 'normal',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/gig/${product.id}`)}
              className="glass-card"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                backgroundColor: 'var(--neutral)',
                border: '1px solid rgba(127, 255, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(127, 255, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Product Image */}
              <div style={{ 
                height: '220px', 
                background: 'linear-gradient(135deg, rgba(127, 255, 0, 0.1), rgba(0, 255, 65, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Package style={{ 
                    width: '4rem', 
                    height: '4rem', 
                    color: 'var(--text-secondary)' 
                  }} />
                )}
                
                {/* Quick View Button */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  opacity: '0',
                  transition: 'opacity 0.3s ease'
                }} className="quick-view">
                  <Eye style={{ width: '1rem', height: '1rem', color: 'white' }} />
                </div>
              </div>

              {/* Product Info */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem',
                  fontWeight: 'bold',
                  lineHeight: '1.4'
                }}>
                  {product.title}
                </h3>
                
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem', 
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.5'
                }}>
                  {product.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ 
                    color: 'var(--secondary)', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold' 
                  }}>
                    KES {product.price?.toLocaleString()}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star style={{ width: '1rem', height: '1rem', color: '#fbbf24', fill: '#fbbf24' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {product.rating?.toFixed(1) || '0.0'}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ 
                    backgroundColor: 'rgba(127, 255, 0, 0.2)', 
                    color: 'var(--accent)', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '15px', 
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {product.category}
                  </span>
                  
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    🚚 {product.deliveryTime} days
                  </span>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: 'rgba(127, 255, 0, 0.1)',
                          color: 'var(--text-secondary)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          border: '1px solid rgba(127, 255, 0, 0.2)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart functionality
                  }}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--primary)',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ShoppingCart style={{ width: '1rem', height: '1rem' }} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-secondary)', 
            fontSize: '1.2rem', 
            marginTop: '4rem',
            padding: '3rem'
          }}>
            <Package style={{ 
              width: '4rem', 
              height: '4rem', 
              margin: '0 auto 1rem',
              color: 'var(--text-secondary)'
            }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              No products found
            </h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to list a product!'}
            </p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .glass-card:hover .quick-view {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}