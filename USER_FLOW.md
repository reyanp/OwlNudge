# User Flow Documentation

## Overview
The application now features a comprehensive user onboarding flow that guides new users through a financial assessment before accessing the main dashboard.

## User Journey

### 1. Landing Page (`/`)
- **First Visit**: Users land on an attractive landing page that introduces the financial planning tool
- **Features Highlighted**:
  - Investment Planning
  - Risk Management
  - Goal Setting
  - AI-Powered Insights
- **Call-to-Action**: "Start Your Financial Assessment" button leads to the quiz

### 2. Financial Assessment Quiz (`/quiz`)
A comprehensive 5-step quiz that collects user information:

#### Step 1: Basic Information
- Age
- Annual income range
- Employment status
- Number of dependents

#### Step 2: Current Financial Situation
- Total savings & investments
- Total debt (excluding mortgage)
- Home ownership status
- Monthly living expenses

#### Step 3: Financial Goals
- Primary financial goal
- Time horizon for main goal
- Target retirement age
- Major purchases planned

#### Step 4: Risk & Investment Profile
- Risk tolerance level
- Investment experience
- Current investment types

#### Step 5: Emergency Fund & Final Review
- Current emergency fund status
- Summary of personalized features

### 3. Main Dashboard (`/dashboard`)
- **Protected Route**: Only accessible after completing the quiz
- **Personalized Content**: 
  - User profile displayed (risk profile, primary focus)
  - Customized recommendations based on quiz responses
  - AI agents tailored to user's financial situation

## Data Storage
- Quiz responses are stored in localStorage
- Data persists across sessions
- Users can retake the assessment using the "Retake Assessment" button

## Technical Implementation

### Routes
```typescript
- "/" - Landing page (redirects to dashboard if quiz completed)
- "/quiz" - Financial assessment quiz
- "/dashboard" - Protected main application (requires quiz completion)
```

### Context Management
- `QuizContext`: Manages quiz data and user profile
- Provides methods to:
  - Store quiz data
  - Clear quiz data
  - Generate user profile based on responses

### Key Components
1. `Landing.tsx` - Welcome page with feature highlights
2. `Quiz.tsx` - Multi-step financial assessment
3. `Dashboard.tsx` - Main application dashboard
4. `ResetQuizButton.tsx` - Allows users to retake assessment
5. `QuizContext.tsx` - Manages quiz state and persistence

## User Benefits
1. **Personalized Experience**: Dashboard and recommendations tailored to individual financial situation
2. **Guided Onboarding**: Structured assessment helps users think through their financial goals
3. **Progress Tracking**: Visual progress bar shows quiz completion
4. **Flexibility**: Users can retake the assessment at any time to update their profile

## Future Enhancements
- Connect quiz data to backend for persistent storage
- Use quiz responses to customize AI agent behavior
- Generate personalized financial plans based on assessment
- Track progress against goals set during quiz