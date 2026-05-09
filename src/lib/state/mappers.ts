import { normalizeEvidence } from "@/lib/actions/evidence-format";
import type { ActionEvidence } from "@/types/domain";

export function mapEvidenceToDomain(raw: ActionEvidence) {
  return normalizeEvidence(raw);
}
