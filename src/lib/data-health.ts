import { differenceInCalendarDays } from "date-fns";
import type { Competitor, CompetitorPriceObservation, CompetitorUnitMapping, Unit, UnitType } from "@/lib/types";
import type { Campaign, OperatorBooking } from "@/lib/operator-demo";
import type { DataHealthIssue, DataHealthReport } from "@/lib/state/storageyield-store";

type DataHealthInput = {
  unitTypes: UnitType[];
  units: Unit[];
  bookings: OperatorBooking[];
  competitors: Competitor[];
  competitorPriceObservations: CompetitorPriceObservation[];
  competitorUnitMappings: CompetitorUnitMapping[];
  campaigns: Campaign[];
  now?: Date;
};

function issue(id: string, title: string, severity: DataHealthIssue["severity"], cta: string): DataHealthIssue {
  return { id, title, severity, cta };
}

export function calculateDataHealth(input: DataHealthInput): DataHealthReport {
  const now = input.now ?? new Date();
  const issues: DataHealthIssue[] = [];

  const missingPrices = input.unitTypes.filter((unitType) => !unitType.current_street_rate_monthly || unitType.current_street_rate_monthly <= 0);
  if (missingPrices.length) issues.push(issue("missing-prices", `${missingPrices.length} unit types are missing street rates`, "high", "Add street rates"));

  const missingStatuses = input.units.filter((unit) => !unit.status);
  if (missingStatuses.length) issues.push(issue("missing-statuses", `${missingStatuses.length} units are missing status`, "high", "Update unit statuses"));

  const mappedOwnUnitTypeIds = new Set(input.competitorUnitMappings.map((mapping) => mapping.own_unit_type_id));
  const unmappedUnitTypes = input.unitTypes.filter((unitType) => !mappedOwnUnitTypeIds.has(unitType.id));
  if (unmappedUnitTypes.length) issues.push(issue("missing-market-mappings", `${unmappedUnitTypes.length} unit types have no competitor mapping`, "medium", "Map competitor unit sizes"));

  const observedCompetitorIds = new Set(input.competitorPriceObservations.map((observation) => observation.competitor_id));
  const competitorsWithoutObservations = input.competitors.filter((competitor) => competitor.status === "active" && !observedCompetitorIds.has(competitor.id));
  if (competitorsWithoutObservations.length) issues.push(issue("missing-observations", `${competitorsWithoutObservations.length} active competitors have no price observation`, "medium", "Add competitor observations"));

  const staleObservations = input.competitorPriceObservations.filter((observation) => differenceInCalendarDays(now, new Date(observation.observed_at)) > 45);
  if (staleObservations.length) issues.push(issue("stale-observations", `${staleObservations.length} competitor observations are older than 45 days`, "medium", "Refresh competitor prices"));

  const occupiedWithoutRent = input.units.filter((unit) => unit.status === "occupied" && !unit.current_rent_monthly);
  if (occupiedWithoutRent.length) issues.push(issue("missing-rent", `${occupiedWithoutRent.length} occupied units are missing current rent`, "high", "Add current rent"));

  const discountedUnits = input.units.filter((unit) => unit.discount_monthly > 0);
  if (discountedUnits.length) issues.push(issue("discount-context", `${discountedUnits.length} units have active discounts to review`, "medium", "Review discount leakage"));

  const staleBookings = input.bookings.filter((booking) => ["requested", "contacted"].includes(booking.status) && differenceInCalendarDays(now, new Date(booking.created_at)) >= 1);
  if (staleBookings.length) issues.push(issue("booking-follow-up", `${staleBookings.length} bookings need follow-up`, "high", "Contact booking leads"));

  const campaignsMissingTargets = input.campaigns.filter((campaign) => !campaign.target_unit_type_id);
  if (campaignsMissingTargets.length) issues.push(issue("campaign-targets", `${campaignsMissingTargets.length} campaigns are missing target unit types`, "low", "Set campaign targets"));

  const penalty = issues.reduce((sum, item) => sum + (item.severity === "high" ? 16 : item.severity === "medium" ? 10 : 6), 0);
  return {
    score: Math.max(0, Math.min(100, 100 - penalty)),
    issues
  };
}
