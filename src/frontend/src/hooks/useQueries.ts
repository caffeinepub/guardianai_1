import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BullyingAlert,
  ChildProfile,
  DashboardSummary,
  LocationRecord,
  ParentSettings,
  SafeZone,
  ScreenTimeRecord,
} from "../backend.d";
import {
  Variant_low_high_medium,
  Variant_new_reviewed_dismissed,
} from "../backend.d";
import { useActor } from "./useActor";

export { Variant_new_reviewed_dismissed, Variant_low_high_medium };

// ── Seed + Children ───────────────────────────────────────
export function useSeedAndChildren() {
  const { actor, isFetching } = useActor();
  return useQuery<ChildProfile[]>({
    queryKey: ["children-seeded"],
    queryFn: async () => {
      if (!actor) return [];
      await actor.seedDemoData();
      return actor.getChildren();
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useChildren() {
  const { actor, isFetching } = useActor();
  return useQuery<ChildProfile[]>({
    queryKey: ["children"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChildren();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Dashboard Summary ─────────────────────────────────────
export function useDashboardSummary(childId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<DashboardSummary | null>({
    queryKey: ["dashboard-summary", childId?.toString()],
    queryFn: async () => {
      if (!actor || childId === null) return null;
      return actor.getDashboardSummary(childId);
    },
    enabled: !!actor && !isFetching && childId !== null,
  });
}

// ── Location ──────────────────────────────────────────────
export function useLocationHistory(childId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<LocationRecord[]>({
    queryKey: ["location-history", childId?.toString()],
    queryFn: async () => {
      if (!actor || childId === null) return [];
      return actor.getLocationHistory(childId);
    },
    enabled: !!actor && !isFetching && childId !== null,
  });
}

export function useLatestLocation(childId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<LocationRecord | null>({
    queryKey: ["latest-location", childId?.toString()],
    queryFn: async () => {
      if (!actor || childId === null) return null;
      return actor.getLatestLocation(childId);
    },
    enabled: !!actor && !isFetching && childId !== null,
  });
}

export function useSafeZones(childId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<SafeZone[]>({
    queryKey: ["safe-zones", childId?.toString()],
    queryFn: async () => {
      if (!actor || childId === null) return [];
      return actor.getSafeZones(childId);
    },
    enabled: !!actor && !isFetching && childId !== null,
  });
}

// ── Screen Time ───────────────────────────────────────────
export function useScreenTimeByDate(childId: bigint | null, date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ScreenTimeRecord[]>({
    queryKey: ["screen-time", childId?.toString(), date],
    queryFn: async () => {
      if (!actor || childId === null) return [];
      return actor.getScreenTimeByDate(childId, date);
    },
    enabled: !!actor && !isFetching && childId !== null,
  });
}

// ── Bullying Alerts ───────────────────────────────────────
export function useBullyingAlerts(childId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<BullyingAlert[]>({
    queryKey: ["bullying-alerts", childId?.toString()],
    queryFn: async () => {
      if (!actor || childId === null) return [];
      return actor.getAlertsByChild(childId);
    },
    enabled: !!actor && !isFetching && childId !== null,
  });
}

export function useUpdateAlertStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: Variant_new_reviewed_dismissed }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateAlertStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bullying-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

// ── Settings ──────────────────────────────────────────────
export function useSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<ParentSettings | null>({
    queryKey: ["settings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      notificationsEnabled,
      weeklyReportEnabled,
      alertThreshold,
    }: {
      notificationsEnabled: boolean;
      weeklyReportEnabled: boolean;
      alertThreshold: Variant_low_high_medium;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSettings(
        notificationsEnabled,
        weeklyReportEnabled,
        alertThreshold,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export function useAddChild() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      age,
      deviceName,
      avatarUrl,
    }: {
      name: string;
      age: bigint;
      deviceName: string;
      avatarUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addChild(name, age, deviceName, avatarUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["children-seeded"] });
    },
  });
}

export function useDeleteChild() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteChild(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["children-seeded"] });
    },
  });
}

// ── Add Safe Zone ──────────────────────────────────────────
export function useAddSafeZone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      childId,
      name,
      address,
      latitude,
      longitude,
      radius,
      isActive,
    }: {
      childId: bigint;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
      radius: bigint;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addSafeZone(
        childId,
        name,
        address,
        latitude,
        longitude,
        radius,
        isActive,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safe-zones"] });
    },
  });
}

export function useDeleteSafeZone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSafeZone(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safe-zones"] });
    },
  });
}

// ── Parent Account ─────────────────────────────────────────
export function useParentAccount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["parent-account"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getParentAccount();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscriptionPlan() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["subscription-plan"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getSubscriptionPlan();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkRecommendationRead() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.markRecommendationRead(id);
    },
  });
}

// ── Spending (from screen time data as proxy) ─────────────
// Note: No direct getSpending endpoint, using summary data
export type {
  ChildProfile,
  DashboardSummary,
  LocationRecord,
  SafeZone,
  ScreenTimeRecord,
  BullyingAlert,
  ParentSettings,
};
