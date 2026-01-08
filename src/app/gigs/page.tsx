'use client';

import { useEffect, useState } from 'react';

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  deliveryTime: string;
  category: string;
  sellerName: string;
  sellerRating: number;
  orders: number;
  featured: boolean;
}

export default function GigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gigs')
      .then(res => res.json())
      .then(data => {
        setGigs(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading gigs...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🇰🇪 TalentHub Kenya - Gigs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <div key={gig.id} className="border rounded-lg p-4 shadow-sm">
            {gig.featured && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2 inline-block">
                Featured
              </span>
            )}
            <h3 className="font-semibold text-lg mb-2">{gig.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{gig.description}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-green-600">
                {gig.currency} {gig.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">{gig.deliveryTime}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>{gig.sellerName} ⭐ {gig.sellerRating}</span>
              <span>{gig.orders} orders</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}