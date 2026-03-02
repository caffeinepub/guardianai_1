# GuardianAI - AI-Powered Parental Control & Child Safety Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- **Marketing/Landing page** (homepage): Hero, feature highlights, testimonials, pricing, CTA to download/sign up
- **Parent Dashboard app**: Full parental monitoring and insights interface

**Marketing Site Sections:**
- Hero section with app preview mockup
- Feature showcase: Location tracking, Screen time analytics, Content analysis, Bullying detection, Spending tracker, AI recommendations
- How it works (3-step flow)
- Testimonials / social proof
- Pricing tiers
- Footer with links

**Parent Dashboard App Sections:**

1. **Overview / Home Dashboard**
   - Child profile selector (support multiple children)
   - Daily summary cards: screen time today, location status, alerts count, spending today
   - AI Insight of the day (parenting recommendation)
   - Recent alerts feed (bullying flags, inappropriate content, location anomalies)

2. **Location Tracking**
   - Current location display (map-style UI with address)
   - Location history timeline (today, this week)
   - Safe zones management (home, school, friend's house)
   - Location alert log (left safe zone, arrived at destination)

3. **Screen Time & App Usage**
   - Total screen time per day/week/month chart
   - Per-app usage breakdown (social, gaming, educational, entertainment)
   - Most used apps list with time spent
   - Screen time limits and schedule settings
   - App blocking controls

4. **Content Analysis (AI-Powered)**
   - Content categories breakdown (educational, social, gaming, entertainment, mature)
   - Flagged content log (inappropriate keywords, mature themes)
   - Websites visited summary
   - AI risk score per content category
   - Trend analysis (is usage improving or worsening)

5. **Bullying Detection**
   - AI-analyzed conversation sentiment overview
   - Alert feed: flagged messages with severity (low/medium/high)
   - Keywords and patterns detected
   - Contacts flagged as potential bullies
   - Recommendations for parents on how to handle each situation

6. **Spending & Financial Activity**
   - Total spending this month
   - Spending by category (in-app purchases, subscriptions, online shopping)
   - Transaction history
   - Spending alerts and limits
   - Allowance tracker

7. **AI Parenting Recommendations**
   - Personalized tips based on child's usage patterns
   - Weekly parenting report (auto-generated)
   - Resource library (articles, guides)
   - Goal setting for child's digital wellness

8. **Settings & Child Profiles**
   - Add/edit child profiles (name, age, device)
   - Notification preferences
   - Reporting schedule
   - Parent account management

**Backend Data Models:**
- Child profiles (id, name, age, device info)
- Location records (childId, lat, lng, timestamp, address)
- Safe zones (childId, name, lat, lng, radius)
- Screen time records (childId, appName, category, durationMinutes, date)
- Content analysis records (childId, url, category, riskScore, flagged, timestamp)
- Bullying alerts (childId, platform, severity, snippet, timestamp, status)
- Spending records (childId, amount, category, merchant, timestamp)
- AI recommendations (childId, type, content, priority, timestamp)
- Parent settings and notifications preferences

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Set up Motoko backend with all data models and CRUD APIs
2. Seed realistic sample data for demo purposes (multiple children, rich activity history)
3. Build marketing landing page with modern design, animations, feature sections
4. Build main app with sidebar navigation and all 8 dashboard sections
5. Wire all dashboard sections to backend APIs
6. Implement charts and data visualizations for metrics
7. Add AI recommendation display logic
8. Implement alert system with severity badges
9. Polish UI with animations, responsive design, accessibility
