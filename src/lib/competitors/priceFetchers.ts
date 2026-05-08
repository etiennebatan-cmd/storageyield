import { CompetitorPriceObservation } from "@/lib/types";

export interface PriceFetcherResult {
  observations: Array<Pick<CompetitorPriceObservation, "observed_price_monthly" | "currency" | "promo_text" | "availability_text" | "source_url" | "observed_at" | "observation_method">>;
  note: string;
}

export async function manualObservationFetcher(): Promise<PriceFetcherResult> {
  return {
    observations: [],
    note: "MVP uses manual observations entered by the operator."
  };
}

export async function futureScrapeFetcher(): Promise<PriceFetcherResult> {
  // Automated competitor price extraction should be implemented per website with permission/compliance checks.
  // MVP uses manual observations and operator-provided URLs.
  return {
    observations: [],
    note: "Automated scraping is not enabled yet."
  };
}

export async function futureScreenshotParser(): Promise<PriceFetcherResult> {
  // Automated competitor price extraction should be implemented per website with permission/compliance checks.
  // MVP uses manual observations and operator-provided URLs.
  return {
    observations: [],
    note: "Screenshot parsing is not enabled yet."
  };
}
