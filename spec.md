# GuardianAI

## Current State
- Marketing landing page at `/` with hero, features, how-it-works, testimonials, and pricing sections
- 8-section parent dashboard at `/dashboard/*`: Overview, Location, Screen Time, Content Analysis, Bullying Detection, Spending Monitor, AI Coach, Settings
- Backend: Motoko with child profiles, location, screen time, content, alerts, recommendations, safe zones, spending, and parent settings
- Authorization component installed
- 2 generated images present: `guardian-shield-icon-transparent.dim_400x400.png`, `hero-app-mockup.dim_800x900.png`
- No payments/subscriptions, no auth flow (login/signup), no child device setup guide
- All pricing CTAs link directly to `/dashboard` (no checkout)

## Requested Changes (Diff)

### Add
- **Parent Auth pages**: `/login` and `/signup` with email + password fields; store email/password in backend; redirect to `/dashboard` on success
- **Stripe payment integration**: Subscription checkout for Family ($9.99/mo) and Guardian Pro ($19.99/mo) plans; payment confirmation page at `/subscribe/:plan`
- **Child Device Setup Guide**: Dedicated page at `/setup-guide` explaining step-by-step how parents install the tracking app on the child's phone (Android + iOS); include QR code instructions, screenshots, and tips
- **Images throughout the app**: Generate and wire 8+ images:
  - Feature section illustration images (6 feature cards)
  - App screenshot showing location tracking
  - App screenshot showing content analysis
  - App screenshot showing bullying detection dashboard
  - Testimonial avatar photos (3)
  - "How It Works" step illustrations
- **Password tracking**: Backend stores hashed parent email + password for account login
- **Dashboard subscription gate**: Show upgrade prompt if user is on free plan

### Modify
- Landing page pricing CTAs: "Start Free Trial" / "Get Started" buttons link to `/signup` then to `/subscribe/:plan` for paid tiers
- Nav "Sign In" → `/login`, "Get Started Free" → `/signup`
- Dashboard nav: add "Setup Guide" link and show current plan/upgrade button
- Dashboard layout: show user email in top-right, add logout option
- Settings page: add "Manage Subscription" section linking to Stripe portal

### Remove
- Nothing removed

## Implementation Plan
1. Select `stripe` Caffeine component
2. Generate updated Motoko backend with: user accounts (email/password hash, subscription tier), Stripe subscription management methods
3. Generate images: 6 feature illustrations, 3 testimonial avatars, 2 app screenshots, setup guide phone screenshots
4. Build frontend:
   - `/login` page: email + password form, "Forgot password" link
   - `/signup` page: email + password + confirm password, plan selection
   - `/subscribe/:plan` page: Stripe checkout integration
   - `/setup-guide` page: step-by-step Android + iOS instructions with phone mockup images
   - Wire all generated images into landing page feature cards, testimonial section, how-it-works
   - Dashboard: user profile in nav, logout, setup guide link, subscription status + upgrade CTA
   - Payments: subscription plan selector, Stripe checkout button, confirmation state
