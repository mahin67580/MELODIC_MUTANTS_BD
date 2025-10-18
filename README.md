# 🎵 Melodic Mutants - Music Learning Platform

A comprehensive full-stack music education platform built with Next.js that connects students with music instructors for online lessons, course management, and interactive learning tools.

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-green?style=for-the-badge&logo=mongodb)

## 🚀 Live Demo
[https://melodic-mutants-bd.vercel.app/](#)

## 📖 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 🎓 Learning & Courses
- **Interactive Course Management** - Create, manage, and enroll in music courses with rich multimedia content
- **Video Lessons** - Built-in video player with progress tracking and playback controls for course content
- **Progress Tracking** - Real-time monitoring of learning progress, completion status, and lesson milestones
- **Certificate Generation** - Automatic professional certificate download upon course completion with student details
- **Rating & Review System** - Comprehensive rating system for courses and instructors with detailed feedback
- **Course Enrollment** - One-click course enrollment with instant access to learning materials
- **Lesson Sequencing** - Structured learning path with prerequisite lessons and progressive difficulty
- **Course Categories** - Organized by instrument type, skill level, and music genres

### 👥 Multi-Role System
- **Students** - Browse courses, book private lessons, track progress, manage profile, and access learning materials
- **Instructors** - Create and publish courses, manage student enrollments, view earnings analytics, schedule     availability
- **Admins** - Comprehensive platform management, user role management, content moderation, and business analytics
- **Role-based Dashboards** - Customized interfaces and functionality for each user type
- **Permission Management** - Granular access control for different platform features

### 💰 Payments & Bookings
- **Stripe Integration** - Secure payment processing with multiple payment methods and currency support
- **Booking System** - Advanced scheduling system for private music lessons with calendar integration
- **Payment Success Handling** - Automated confirmation emails, digital receipts, and booking confirmations
- **Pricing Tiers** - Flexible pricing models for courses, packages, and individual lessons
- **Refund Management** - Streamlined refund processing and dispute resolution
- **Revenue Tracking** - Real-time earnings dashboard for instructors with payout scheduling

### 🎵 Music Tools & Utilities
- **Chord Finder** - Interactive chord discovery tool with voicing variations and audio playback
- **Scale Finder** - Comprehensive music scale reference with visual fingerboard/keys and audio examples
- **Circle of Fifths** - Dynamic visual music theory tool with key relationships and chord progressions
- **Metronome** - Customizable practice tool with variable tempo, time signatures, and visual cues
- **Instrument Tuner** - Built-in tuning reference for various instruments (planned feature)
- **Practice Tracker** - Session logging and practice habit formation tools
- **Music Theory Library** - Educational resources and reference materials

### 🔐 Authentication & Security
- **NextAuth.js** - Complete authentication system with session management and JWT tokens
- **Role-based Access Control** - Secure route protection and feature access based on user roles
- **Social Login** - Multiple OAuth providers including Google, Facebook, and Apple integration
- **BCrypt Password Hashing** - Enterprise-grade credential storage and security
- **Email Verification** - Account confirmation and password reset functionality
- **Session Management** - Secure token refresh and automatic session handling

### 📊 Analytics & Management
- **Dashboard Analytics** - Comprehensive performance insights with charts, metrics, and growth tracking
- **Course Management** - Full CRUD operations with rich text editing, media uploads, and SEO optimization
- **User Management** - Advanced admin controls for user moderation, role assignment, and account management
- **Revenue Analytics** - Financial reporting, earnings breakdown, and payment history
- **Student Progress Tracking** - Individual and cohort learning analytics for instructors
- **Engagement Metrics** - Course completion rates, student retention, and platform usage statistics

### 🎨 User Experience & Interface
- **Responsive Design** - Mobile-first approach with seamless experience across all devices
- **Modern UI Components** - Consistent design system using Shadcn/UI and Tailwind CSS
- **Interactive Elements** - Smooth animations, hover effects, and engaging user interactions
- **Accessibility** - WCAG compliant with keyboard navigation and screen reader support
- **Dark/Light Mode** - Theme switching with persistent user preferences
- **Loading States** - Elegant skeleton screens and progress indicators

### 📱 Platform Capabilities
- **Real-time Notifications** - Instant updates for bookings, messages, and course activities
- **File Upload System** - Support for videos, images, PDFs, and audio files via Cloudinary
- **Search & Filtering** - Advanced search functionality with multiple filter criteria
- **Pagination & Infinite Scroll** - Optimized performance for large datasets
- **SEO Optimization** - Meta tags, structured data, and search engine friendly URLs
- **Performance Monitoring** - Core Web Vitals tracking and optimization

### 🔄 Business Features
- **Instructor Onboarding** - Streamlined registration and verification process for new teachers
- **Course Approval Workflow** - Admin review and quality control for published content
- **Commission System** - Configurable platform fees and instructor payout structure
- **Content Moderation** - Reporting system and admin tools for content quality management
- **Multi-language Support** - Internationalization ready for global expansion
- **API Ecosystem** - RESTful API structure for future integrations and mobile apps

### 🛠 Technical Excellence
- **Full-stack Architecture** - Unified React/Next.js framework with API routes
- **Database Optimization** - Efficient MongoDB queries with proper indexing and aggregation
- **Image Optimization** - Automatic resizing, WebP conversion, and lazy loading
- **Code Splitting** - Dynamic imports and bundle optimization for faster loading
- **Error Handling** - Comprehensive error boundaries and user-friendly error messages
- **Security Headers** - CSP, CORS, and other security best practices implemented

Each feature is designed with both the end-user experience and platform scalability in mind, creating a robust ecosystem for music education that serves students, instructors, and administrators effectively.


## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Stripe account
- Cloudinary account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/mahin67580/MELODIC_MUTANTS_BD.git
   cd melodic-mutants-bd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # Stripe
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


## 🔌 API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/instructor/register` - Instructor registration
- `POST /api/instructor/check` - Instructor verification

### Courses & Learning
- `GET/POST /api/courses` - Course management
- `GET/PUT /api/courses/[id]` - Single course operations
- `POST /api/progress` - Learning progress tracking
- `POST /api/certificate` - Certificate generation

### Payments & Bookings
- `POST /api/create-payment-intent` - Stripe payment setup
- `POST /api/bookings` - Lesson booking management
- `GET /api/my-bookings/[id]` - User bookings

### Admin
- `PUT /api/admin/updateRole` - User role management
- `GET /api/admin/users` - User management

## 🎯 Key Components

### UI Components (Shadcn/UI)
- **Form Elements** - Input, Select, Checkbox, Radio
- **Navigation** - Tabs, Accordion, Navigation Menu
- **Feedback** - Alert, Dialog, Tooltip, Progress
- **Layout** - Card, Sheet, Separator

### Custom Components
- **ChordFinder** - Interactive chord discovery
- **ScaleFinder** - Music scale visualization
- **Metronome** - Practice timing tool
- **VideoPlayer** - Course video content
- **MapComponent** - Location services

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Railway: Project Variables

## 🤝 Contributing


### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Deployment platform
- **Shadcn/UI** - Beautiful component library
- **Stripe** - Payment processing
- **Music Education Community** - Inspiration and feedback

---

**Built with ❤️ for music learners and educators worldwide**

---
