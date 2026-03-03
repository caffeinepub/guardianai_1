import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ParentSettings {
    notificationsEnabled: boolean;
    alertThreshold: Variant_low_high_medium;
    weeklyReportEnabled: boolean;
    parentId: Principal;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface ScreenTimeRecord {
    id: ProfileId;
    appName: string;
    date: string;
    childId: ProfileId;
    durationMinutes: bigint;
    category: Category;
}
export type ProfileId = bigint;
export interface ParentAccount {
    createdAt: Time;
    plan: SubscriptionPlan;
    email: string;
    passwordHash: string;
}
export interface DashboardSummary {
    todayScreenTime: bigint;
    todaySpendingTotal: bigint;
    latestLocation?: LocationRecord;
    unreadAlertsCount: bigint;
    unreadRecommendationsCount: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ChildProfile {
    id: ProfileId;
    age: bigint;
    name: string;
    createdAt: Time;
    avatarUrl: string;
    deviceName: string;
    parentId: Principal;
}
export interface LocationRecord {
    id: ProfileId;
    latitude: number;
    childId: ProfileId;
    longitude: number;
    address: string;
    timestamp: Time;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface SafeZone {
    id: ProfileId;
    latitude: number;
    name: string;
    childId: ProfileId;
    isActive: boolean;
    longitude: number;
    address: string;
    radius: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface BullyingAlert {
    id: ProfileId;
    status: Variant_new_reviewed_dismissed;
    childId: ProfileId;
    platform: string;
    snippet: string;
    timestamp: Time;
    severity: Variant_low_high_medium;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    social = "social",
    other = "other",
    entertainment = "entertainment",
    gaming = "gaming",
    educational = "educational"
}
export enum Recommendation {
    wellbeing = "wellbeing",
    content = "content",
    screen_time = "screen_time",
    social = "social",
    financial = "financial"
}
export enum SubscriptionPlan {
    free = "free",
    guardian_pro = "guardian_pro",
    family = "family"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_low_high_medium {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum Variant_new_reviewed_dismissed {
    new_ = "new",
    reviewed = "reviewed",
    dismissed = "dismissed"
}
export interface backendInterface {
    addBullyingAlert(childId: ProfileId, platform: string, severity: Variant_low_high_medium, snippet: string): Promise<ProfileId>;
    addChild(name: string, age: bigint, deviceName: string, avatarUrl: string): Promise<ProfileId>;
    addContent(childId: ProfileId, url: string, title: string, category: Category, riskScore: bigint, flagged: boolean): Promise<ProfileId>;
    addLocation(childId: ProfileId, latitude: number, longitude: number, address: string): Promise<ProfileId>;
    addRecommendation(childId: ProfileId, tipType: Recommendation, content: string, priority: bigint): Promise<ProfileId>;
    addSafeZone(childId: ProfileId, name: string, address: string, latitude: number, longitude: number, radius: bigint, isActive: boolean): Promise<ProfileId>;
    addScreenTime(childId: ProfileId, appName: string, category: Category, durationMinutes: bigint, date: string): Promise<ProfileId>;
    addSpending(childId: ProfileId, amount: bigint, category: string, merchant: string): Promise<ProfileId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createSubscriptionCheckoutSession(plan: SubscriptionPlan): Promise<string>;
    deleteChild(id: ProfileId): Promise<void>;
    deleteSafeZone(id: ProfileId): Promise<void>;
    getAlertsByChild(childId: ProfileId): Promise<Array<BullyingAlert>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChild(id: ProfileId): Promise<ChildProfile>;
    getChildren(): Promise<Array<ChildProfile>>;
    getDashboardSummary(childId: ProfileId): Promise<DashboardSummary>;
    getLatestLocation(childId: ProfileId): Promise<LocationRecord | null>;
    getLocationHistory(childId: ProfileId): Promise<Array<LocationRecord>>;
    getParentAccount(): Promise<ParentAccount>;
    getSafeZones(childId: ProfileId): Promise<Array<SafeZone>>;
    getScreenTimeByDate(childId: ProfileId, date: string): Promise<Array<ScreenTimeRecord>>;
    getSettings(): Promise<ParentSettings>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSubscriptionPlan(): Promise<SubscriptionPlan>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    handleStripeWebhook(sessionId: string, plan: SubscriptionPlan): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isFeatureUnlocked(feature: string): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    loginParent(email: string, passwordHash: string): Promise<boolean>;
    markRecommendationRead(id: ProfileId): Promise<void>;
    registerParent(email: string, passwordHash: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedDemoData(): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAlertStatus(id: ProfileId, status: Variant_new_reviewed_dismissed): Promise<void>;
    updateChild(id: ProfileId, name: string, age: bigint, deviceName: string, avatarUrl: string): Promise<void>;
    updateParentEmail(email: string): Promise<void>;
    updateParentPassword(passwordHash: string): Promise<void>;
    updateSafeZone(id: ProfileId, name: string, address: string, latitude: number, longitude: number, radius: bigint, isActive: boolean): Promise<void>;
    updateSettings(notificationsEnabled: boolean, weeklyReportEnabled: boolean, alertThreshold: Variant_low_high_medium): Promise<void>;
    updateSubscriptionPlan(plan: SubscriptionPlan): Promise<void>;
}
