# A.M Creativ - Strategic Discovery Form

A modern, interactive intake form for A.M Creativ's video marketing agency, built with React, TypeScript, and Vercel AI integration with Google Gemini.

## Features

- **Multi-step Form**: 5-step wizard for comprehensive client discovery
- **AI-Powered Analysis**: Google Gemini integration for strategic brief analysis
- **Responsive Design**: Apple-inspired minimal UI with dark theme
- **PDF Export**: Downloadable strategic blueprint
- **Local Storage**: Form progress persistence
- **Vercel Deployment**: Optimized for Vercel hosting

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **AI**: Google Gemini API via Vercel AI
- **Styling**: CSS with custom properties
- **PDF Generation**: jsPDF
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd amcreativ-intake
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run locally with Vercel CLI**
   ```bash
   # Install Vercel CLI globally
   npm i -g vercel
   
   # Start development server
   vercel dev
   ```

   Or run with Vite directly:
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel
   - Import the project

2. **Set Environment Variables**
   In your Vercel dashboard, add:
   - `GEMINI_API_KEY`: Your Google Gemini API key

3. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Or manually deploy from the Vercel dashboard

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## Project Structure

```
├── api/
│   └── analyze-brief.ts    # Vercel API route for AI analysis
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment
├── public/
│   └── index.html          # Main HTML file
├── index.tsx               # React application
├── package.json            # Dependencies and scripts
├── vercel.json            # Vercel configuration
├── vite.config.ts         # Vite configuration
└── .env.example           # Environment variables template
```

## API Endpoints

### POST /api/analyze-brief

Analyzes client brief data using Google Gemini AI.

**Request Body:**
```json
{
  "briefData": {
    "discovery": { ... },
    "strategy": { ... },
    "deliverables": { ... },
    "contact": { ... }
  }
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "Strategic analysis text..."
}
```

## Customization

### Styling
- Modify CSS custom properties in `index.html` for theme changes
- Colors, fonts, and spacing can be adjusted in the `:root` section

### Form Fields
- Update `QUESTION_DEFS` object in `index.tsx` to modify form questions
- Add new steps by updating the `STEPS` array

### AI Analysis
- Modify the prompt in `api/analyze-brief.ts` to change analysis output
- Adjust the Google Gemini model parameters as needed

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure `GEMINI_API_KEY` is set in Vercel environment variables
   - Check that the API key is valid and has proper permissions

2. **Build Failures**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors with `npm run build`

3. **Local Development Issues**
   - Use `vercel dev` instead of `npm run dev` for full Vercel functionality
   - Ensure environment variables are set in `.env.local`

## License

© 2024 A.M Creativ - All rights reserved