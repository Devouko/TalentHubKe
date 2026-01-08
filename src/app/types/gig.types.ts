export interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  isOnline: boolean;
  verified: boolean;
  hourlyRate?: number;
  totalEarnings?: number;
  successRate?: number;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  freelancer: Freelancer;
  category: string;
  subcategory: string;
  price: {
    basic: number;
    standard?: number;
    premium?: number;
  };
  deliveryTime: number;
  rating: number;
  reviewCount: number;
  images: string[];
  skills: string[];
  tags: string[];
  isFeatured: boolean;
  isTopRated: boolean;
}

export type UserType = 'client' | 'freelancer' | 'agency';
