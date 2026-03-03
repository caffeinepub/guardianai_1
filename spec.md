# GuardianAI — Flagship Update

## Current State
- Full marketing landing page with hero, features, pricing, testimonials, footer
- Parent dashboard with 8 sections: Overview, Location, Screen Time, Content, Bullying, Spending, AI Coach, Settings
- Auth pages: Login, Signup, Subscribe (Stripe only)
- Setup guide page (basic 4-step flow inside dashboard + standalone route)
- All images are generated but some fail to load in certain contexts
- Footer/legal links are non-functional (no pages behind them)
- Payment page only shows Stripe; no PayPal, Apple Pay, Google Pay, crypto
- No payout/payment-details settings for the app owner
- No Privacy Policy, Terms of Service, COPPA, or Support pages
- No in-app background monitoring install walkthrough (detailed)

## Requested Changes (Diff)

### Add
- `/privacy` — Full Privacy Policy page (COPPA-compliant, data collection, retention, sharing)
- `/terms` — Terms of Service page (subscription terms, acceptable use, liability)
- `/support` — Support center with FAQ categories, contact form, live chat placeholder
- `/legal` — Legal hub linking to all legal pages
- `/payment-settings` (admin route inside dashboard) — Payout configuration page where owner enters Stripe secret key, PayPal client ID, payment method toggles
- Enhanced `/subscribe/:plan` — Show all payment method options: Credit Card (Stripe), PayPal, Apple Pay, Google Pay, with method selector tabs
- Enhanced Setup Guide — Add detailed "Background Monitoring" section explaining how the child app runs silently, battery optimization bypass, permissions required (Android/iOS), and how parents get push reports
- New images: phone screen showing background service active, parent report notification mockup, Android permissions screen, iOS Screen Time API screen, payment methods banner

### Modify
- `LandingPage.tsx` — Wire footer Legal, Privacy, Terms, Support links to real routes; add nav link for Support
- `SettingsPage.tsx` — Add "Payment Settings" link for admin/owner use
- `SetupGuidePage.tsx` — Expand Step 3 (Install) with detailed background monitoring permissions sub-steps for Android and iOS; add Step 5 "Background Reports" explaining push notifications

### Remove
- Nothing removed

## Implementation Plan
1. Generate all missing/new images (background service, permissions screenshots, payment banner, report notification)
2. Create `/privacy` page with full COPPA-compliant privacy policy text
3. Create `/terms` page with subscription and acceptable use terms
4. Create `/support` page with FAQ accordion by category + contact form
5. Create `/legal` hub page
6. Create `/dashboard/payment-settings` page (owner payout config: Stripe key, PayPal ID, toggles for each payment method)
7. Update `SubscribePage.tsx` to show payment method selector (Credit Card, PayPal, Apple Pay, Google Pay tabs)
8. Update `SetupGuidePage.tsx` with detailed background monitoring steps and Android/iOS permission walkthrough
9. Update `LandingPage.tsx` footer links and nav
10. Update `routeTree.ts` to register all new routes
11. Validate, typecheck, build
