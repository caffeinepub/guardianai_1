import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddSafeZone,
  useDeleteSafeZone,
  useLatestLocation,
  useLocationHistory,
  useSafeZones,
} from "../../hooks/useQueries";
import { useDashboard } from "./DashboardLayout";

// ── Location Map Visual ───────────────────────────────────
function LocationMapVisual({
  lat,
  lng,
}: { address: string; lat: number; lng: number }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden h-48"
      style={{
        background: "oklch(0.12 0.03 220)",
        border: "1px solid oklch(0.25 0.04 265)",
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.78 0.15 195 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.15 195 / 0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Road lines */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 left-0 right-0 h-6 -translate-y-1/2 rounded-full"
          style={{ background: "oklch(0.18 0.03 220)", opacity: 0.8 }}
        />
        <div
          className="absolute top-0 bottom-0 left-1/3 w-4 rounded-full"
          style={{ background: "oklch(0.18 0.03 220)", opacity: 0.8 }}
        />
        <div
          className="absolute top-0 bottom-0 right-1/4 w-4 rounded-full"
          style={{ background: "oklch(0.18 0.03 220)", opacity: 0.8 }}
        />
      </div>
      {/* Location pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
        <div className="relative">
          <div
            className="w-12 h-12 rounded-full animate-pulse-ring absolute -inset-2"
            style={{ background: "oklch(0.78 0.15 195 / 0.3)" }}
          />
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "oklch(0.78 0.15 195)",
              boxShadow: "0 0 20px oklch(0.78 0.15 195 / 0.6)",
            }}
          >
            <MapPin size={20} style={{ color: "oklch(0.08 0.02 265)" }} />
          </div>
        </div>
      </div>
      {/* Coordinate badge */}
      <div
        className="absolute bottom-3 left-3 rounded-lg px-3 py-1.5 text-xs font-mono backdrop-blur-sm"
        style={{
          background: "oklch(0.12 0.025 265 / 0.9)",
          border: "1px solid oklch(0.25 0.04 265)",
          color: "oklch(0.78 0.15 195)",
        }}
      >
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </div>
      {/* Live badge */}
      <div
        className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          background: "oklch(0.18 0.06 155 / 0.9)",
          border: "1px solid oklch(0.72 0.18 155 / 0.5)",
          color: "oklch(0.72 0.18 155)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
        LIVE
      </div>
    </div>
  );
}

// ── Safe Zone Item ────────────────────────────────────────
function SafeZoneItem({
  zone,
  index,
  onDelete,
}: {
  zone: {
    id: bigint;
    name: string;
    address: string;
    isActive: boolean;
    radius: bigint;
  };
  index: number;
  onDelete: (id: bigint) => void;
}) {
  const [active, setActive] = useState(zone.isActive);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      data-ocid={`location.safe_zone.item.${index}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: active
            ? "oklch(0.2 0.06 155 / 0.5)"
            : "oklch(0.18 0.03 265)",
          color: active ? "oklch(0.72 0.18 155)" : "oklch(0.5 0.02 265)",
        }}
      >
        <Shield size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-foreground">
            {zone.name}
          </span>
          <Badge
            className="text-[10px] h-4 border-0"
            style={{
              background: active
                ? "oklch(0.2 0.06 155 / 0.4)"
                : "oklch(0.18 0.03 265 / 0.6)",
              color: active ? "oklch(0.72 0.18 155)" : "oklch(0.5 0.02 265)",
            }}
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{zone.address}</p>
        <p className="text-[10px] text-muted-foreground/60">
          {Number(zone.radius)}m radius
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Switch
          data-ocid={`location.safe_zone.toggle.${index}`}
          checked={active}
          onCheckedChange={setActive}
        />
        {confirmDelete ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid={`location.safe_zone.delete_button.${index}`}
              size="sm"
              className="h-7 text-xs"
              style={{
                background: "oklch(0.65 0.22 25)",
                color: "oklch(0.98 0 0)",
              }}
              onClick={() => onDelete(zone.id)}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
            data-ocid={`location.safe_zone.open_modal_button.${index}`}
          >
            <Trash2 size={13} />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Location History Item ─────────────────────────────────
function LocationHistoryItem({
  record,
  index,
}: {
  record: {
    address: string;
    timestamp: bigint;
    latitude: number;
    longitude: number;
  };
  index: number;
}) {
  const date = new Date(Number(record.timestamp) / 1_000_000);
  return (
    <div
      data-ocid={`location.history.item.${index}`}
      className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0"
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: "oklch(0.18 0.04 195)",
          color: "oklch(0.78 0.15 195)",
        }}
      >
        <Navigation size={10} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{record.address}</p>
        <p className="text-xs text-muted-foreground">
          {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs text-muted-foreground">
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="text-[10px] text-muted-foreground/60">
          {date.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// ── Location Page ─────────────────────────────────────────
export default function LocationPage() {
  const { selectedChild } = useDashboard();
  const childId = selectedChild?.id ?? null;

  const { data: latest, isLoading: latestLoading } = useLatestLocation(childId);
  const { data: history = [], isLoading: historyLoading } =
    useLocationHistory(childId);
  const { data: safeZones = [], isLoading: zonesLoading } =
    useSafeZones(childId);
  const addSafeZone = useAddSafeZone();
  const deleteSafeZone = useDeleteSafeZone();

  const [addZoneOpen, setAddZoneOpen] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneAddress, setZoneAddress] = useState("");

  const handleAddZone = async () => {
    if (!childId) {
      toast.error("No child selected");
      return;
    }
    if (!zoneName.trim() || !zoneAddress.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addSafeZone.mutateAsync({
        childId,
        name: zoneName.trim(),
        address: zoneAddress.trim(),
        latitude: 37.7749 + Math.random() * 0.1,
        longitude: -122.4194 + Math.random() * 0.1,
        radius: BigInt(500),
        isActive: true,
      });
      toast.success(`Safe zone "${zoneName}" added`);
      setAddZoneOpen(false);
      setZoneName("");
      setZoneAddress("");
    } catch {
      toast.error("Failed to add safe zone");
    }
  };

  const handleDeleteZone = async (id: bigint) => {
    try {
      await deleteSafeZone.mutateAsync(id);
      toast.success("Safe zone removed");
    } catch {
      toast.error("Failed to remove safe zone");
    }
  };

  return (
    <div data-ocid="location.page" className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Location Tracking
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Real-time GPS tracking and safe zone management for{" "}
          {selectedChild?.name ?? "your child"}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current location */}
        <div className="rounded-2xl p-5 bg-card border border-border flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Current Location
            </h2>
            <Badge
              className="text-[10px] h-4 border-0 gap-1 ml-auto"
              style={{
                background: "oklch(0.2 0.06 155 / 0.4)",
                color: "oklch(0.72 0.18 155)",
              }}
            >
              <span className="w-1 h-1 rounded-full bg-brand-green" />
              Live
            </Badge>
          </div>

          {latestLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : latest ? (
            <>
              <LocationMapVisual
                address={latest.address}
                lat={latest.latitude}
                lng={latest.longitude}
              />
              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {latest.address}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={10} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      Updated:{" "}
                      {new Date(
                        Number(latest.timestamp) / 1_000_000,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              data-ocid="location.current.empty_state"
              className="h-48 flex items-center justify-center text-sm text-muted-foreground"
            >
              No location data available
            </div>
          )}
        </div>

        {/* Safe zones */}
        <div className="rounded-2xl p-5 bg-card border border-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-green" />
              <h2 className="font-heading font-semibold text-sm text-foreground">
                Safe Zones
              </h2>
            </div>
            <Button
              data-ocid="location.safe_zone.add_button"
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 border-border/60"
              onClick={() => setAddZoneOpen(true)}
            >
              <Plus size={12} />
              Add Zone
            </Button>
          </div>

          {zonesLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : safeZones.length === 0 ? (
            <div
              data-ocid="location.safe_zones.empty_state"
              className="flex flex-col items-center gap-2 py-8 text-center"
            >
              <Shield size={32} className="text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">
                No safe zones configured yet
              </p>
              <p className="text-xs text-muted-foreground/60">
                Add home, school, and other safe locations
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {safeZones.map((zone, i) => (
                <SafeZoneItem
                  key={zone.id.toString()}
                  zone={zone}
                  index={i + 1}
                  onDelete={handleDeleteZone}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location history */}
      <div className="rounded-2xl p-5 bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h2 className="font-heading font-semibold text-sm text-foreground">
              Location History
            </h2>
          </div>
          <Badge
            className="text-[10px] border-0"
            style={{
              background: "oklch(0.18 0.03 265)",
              color: "oklch(0.58 0.04 265)",
            }}
          >
            Last 24h
          </Badge>
        </div>

        {historyLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div
            data-ocid="location.history.empty_state"
            className="py-8 text-center text-sm text-muted-foreground"
          >
            No location history available
          </div>
        ) : (
          <div>
            {history.slice(0, 10).map((record, i) => (
              <LocationHistoryItem
                key={record.id.toString()}
                record={record}
                index={i + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Safe Zone Dialog */}
      <Dialog open={addZoneOpen} onOpenChange={setAddZoneOpen}>
        <DialogContent
          data-ocid="location.add_zone.dialog"
          className="bg-card border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="font-heading">Add Safe Zone</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="zone-name"
                className="text-xs text-muted-foreground"
              >
                Zone Name
              </Label>
              <Input
                id="zone-name"
                data-ocid="location.add_zone.input"
                placeholder="e.g. Home, School"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="zone-address"
                className="text-xs text-muted-foreground"
              >
                Address
              </Label>
              <Input
                id="zone-address"
                placeholder="e.g. 123 Main St, City"
                value={zoneAddress}
                onChange={(e) => setZoneAddress(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="location.add_zone.cancel_button"
              variant="ghost"
              onClick={() => setAddZoneOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="location.add_zone.submit_button"
              className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
              onClick={handleAddZone}
              disabled={addSafeZone.isPending}
            >
              {addSafeZone.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Add Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
