# AI Healthcare Assistant

A comprehensive AI-powered healthcare assistant that analyzes user symptoms and provides personalized health recommendations. Built with Next.js, Supabase, and advanced AI analysis algorithms.

## Features

- **Intelligent Symptom Analysis**: AI-powered symptom checker with confidence scoring
- **Risk Assessment**: Automated risk level calculation (low, moderate, high, critical)
- **Personalized Recommendations**: Tailored health advice based on symptoms and medical history
- **User Authentication**: Secure user accounts with Supabase Auth
- **Health Dashboard**: Personal dashboard to track assessment history
- **Responsive Design**: Mobile-first design with professional medical interface
- **Real-time Analysis**: Instant symptom processing and results

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI, shadcn/ui
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ai-healthcare-assistant
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
   
   # Optional: Analytics and Monitoring
   GOOGLE_SITE_VERIFICATION=your_google_verification_code
   \`\`\`

4. **Set up the database**
   Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   - `01-create-tables.sql` - Creates the database schema
   - `02-seed-sample-data.sql` - Adds sample data (optional)

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
   - Push your code to GitHub
   - Import the project in Vercel dashboard

2. **Configure environment variables**
   Add all environment variables from `.env.local` to your Vercel project settings

3. **Set up Supabase integration**
   - Connect Supabase integration in Vercel
   - Configure authentication redirect URLs in Supabase dashboard

4. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Database Setup

The application requires the following database tables:
- `users` - User profiles and information
- `medical_conditions` - User's existing medical conditions
- `symptom_assessments` - Symptom reports from users
- `ai_analysis_results` - AI analysis results and predictions
- `health_recommendations` - Personalized health recommendations

All tables include Row Level Security (RLS) policies for data protection.

## Usage

### For Users

1. **Create an account** or use as a guest
2. **Complete symptom assessment** by selecting symptoms and providing details
3. **Review AI analysis** with predicted conditions and risk levels
4. **Follow recommendations** and consult healthcare providers as advised
5. **Track history** in your personal dashboard (registered users)

### For Developers

The application is structured with:
- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and AI analysis engine
- `/scripts` - Database setup and migration scripts

## AI Analysis Engine

The AI analysis engine (`/lib/ai-analysis.ts`) includes:
- Symptom-to-condition mapping
- Confidence scoring algorithms
- Risk level calculation
- Emergency symptom detection
- Personalized recommendation generation

## Security & Privacy

- All user data is encrypted and stored securely in Supabase
- Row Level Security (RLS) ensures users can only access their own data
- HIPAA-compliant data handling practices
- No medical data is shared with third parties
- Secure authentication with Supabase Auth

## Medical Disclaimer

This application provides preliminary health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [support@healthcareai.com](mailto:support@healthcareai.com) or open an issue on GitHub.
