import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { createElement } from "react";
import LandingPage from "./pages/LandingPage";
import BullyingPage from "./pages/dashboard/BullyingPage";
import ContentPage from "./pages/dashboard/ContentPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import LocationPage from "./pages/dashboard/LocationPage";
import RecommendationsPage from "./pages/dashboard/RecommendationsPage";
import ScreenTimePage from "./pages/dashboard/ScreenTimePage";
import SettingsPage from "./pages/dashboard/SettingsPage";
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

export const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    locationRoute,
    screenTimeRoute,
    contentRoute,
    bullyingRoute,
    spendingRoute,
    recommendationsRoute,
    settingsRoute,
  ]),
]);
