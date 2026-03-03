import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { createElement } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SetupGuideStandalone from "./pages/SetupGuideStandalone";
import SignupPage from "./pages/SignupPage";
import SubscribePage from "./pages/SubscribePage";
import BullyingPage from "./pages/dashboard/BullyingPage";
import ContentPage from "./pages/dashboard/ContentPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import LocationPage from "./pages/dashboard/LocationPage";
import RecommendationsPage from "./pages/dashboard/RecommendationsPage";
import ScreenTimePage from "./pages/dashboard/ScreenTimePage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import SetupGuideDashboard from "./pages/dashboard/SetupGuideDashboard";
import SpendingPage from "./pages/dashboard/SpendingPage";

// Root route - renders children via Outlet
const rootRoute = createRootRoute({
  component: () => createElement(Outlet),
});

// Landing
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

// Auth routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
  validateSearch: (search: Record<string, unknown>) => ({
    plan: typeof search.plan === "string" ? search.plan : undefined,
  }),
});

const subscribeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscribe/$plan",
  component: SubscribePage,
});

const setupGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/setup-guide",
  component: SetupGuideStandalone,
});

// Dashboard layout
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayout,
});

// Dashboard child routes
const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: DashboardHome,
});

const locationRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/location",
  component: LocationPage,
});

const screenTimeRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/screen-time",
  component: ScreenTimePage,
});

const contentRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/content",
  component: ContentPage,
});

const bullyingRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/bullying",
  component: BullyingPage,
});

const spendingRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/spending",
  component: SpendingPage,
});

const recommendationsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/recommendations",
  component: RecommendationsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/settings",
  component: SettingsPage,
});

const dashboardSetupGuideRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/setup-guide",
  component: SetupGuideDashboard,
});

export const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  signupRoute,
  subscribeRoute,
  setupGuideRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    locationRoute,
    screenTimeRoute,
    contentRoute,
    bullyingRoute,
    spendingRoute,
    recommendationsRoute,
    settingsRoute,
    dashboardSetupGuideRoute,
  ]),
]);
