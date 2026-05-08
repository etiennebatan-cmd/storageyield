export function isDemoMode() {
  return process.env.STORAGEYIELD_DEMO_MODE !== "false" && process.env.NEXT_PUBLIC_STORAGEYIELD_DEMO_MODE !== "false";
}
