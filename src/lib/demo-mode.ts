export function isDemoMode() {
  return process.env.STORAGEYIELD_FORCE_DEMO === "true" || process.env.NEXT_PUBLIC_STORAGEYIELD_FORCE_DEMO === "true";
}
