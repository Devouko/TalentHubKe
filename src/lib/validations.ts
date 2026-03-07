import { z } from 'zod';

/**
 * User-related validation schemas
 * These schemas validate user input for authentication and profile management
 */
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  image: z.string().url('Invalid image URL').optional(),
  userType: z.enum(['CLIENT', 'FREELANCER', 'AGENCY']),
  balance: z.number().min(0, 'Balance cannot be negative'),
});

/**
 * Gig creation and update validation schema
 * Validates service listings with comprehensive field validation
 */
export const GigSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
  price: z.number().min(5, 'Minimum price is $5').max(10000, 'Maximum price is $10,000'),
  deliveryTime: z.number().min(1, 'Minimum delivery time is 1 day').max(365, 'Maximum delivery time is 365 days'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
});

/**
 * Package validation schema for gig tiers
 * Validates different service packages (basic, standard, premium)
 */
export const PackageSchema = z.object({
  name: z.string().min(3, 'Package name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().min(5, 'Minimum price is $5'),
  deliveryTime: z.number().min(1, 'Minimum delivery time is 1 day'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
});

/**
 * Order creation validation schema
 * Validates order placement with requirements and package selection
 */
export const OrderSchema = z.object({
  gigId: z.string().cuid('Invalid gig ID'),
  packageId: z.string().cuid('Invalid package ID').optional(),
  requirements: z.string().max(1000, 'Requirements too long').optional(),
  totalAmount: z.number().min(5, 'Minimum order amount is $5'),
});

/**
 * Review validation schema
 * Validates user reviews and ratings
 */
export const ReviewSchema = z.object({
  rating: z.number().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  comment: z.string().max(500, 'Comment too long').optional(),
  orderId: z.string().cuid('Invalid order ID'),
});

/**
 * Message validation schema
 * Validates chat messages between users
 */
export const MessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  attachments: z.array(z.string().url('Invalid attachment URL')).max(5, 'Maximum 5 attachments'),
  orderId: z.string().cuid('Invalid order ID'),
});

/**
 * Proposal validation schema
 * Validates freelancer proposals for projects
 */
export const ProposalSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title too long'),
  description: z.string().min(100, 'Description must be at least 100 characters').max(2000, 'Description too long'),
  budget: z.number().min(10, 'Minimum budget is $10').max(50000, 'Maximum budget is $50,000'),
  timeline: z.number().min(1, 'Minimum timeline is 1 day').max(365, 'Maximum timeline is 365 days'),
});

/**
 * Category validation schema
 * Validates service categories
 */
export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(50, 'Category name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  icon: z.string().optional(),
});

// Type exports for TypeScript integration
export type User = z.infer<typeof UserSchema>;
export type Gig = z.infer<typeof GigSchema>;
export type Package = z.infer<typeof PackageSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;
export type Category = z.infer<typeof CategorySchema>;

/**
 * Form validation schemas for client-side validation
 * These are used with react-hook-form for real-time validation
 */
export const CreateGigFormSchema = GigSchema.omit({ id: true });
export const UpdateGigFormSchema = GigSchema.partial();
export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export const RegisterFormSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  userType: z.enum(['CLIENT', 'FREELANCER', 'AGENCY']),
});

// Form type exports
export type CreateGigForm = z.infer<typeof CreateGigFormSchema>;
export type UpdateGigForm = z.infer<typeof UpdateGigFormSchema>;
export type LoginForm = z.infer<typeof LoginFormSchema>;
export type RegisterForm = z.infer<typeof RegisterFormSchema>;
