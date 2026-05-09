import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/marketing/site-config";

export function PageSpecificCta({
  title = "Klaar om StorageYield op je locatie te zien?",
  copy = "Plan een demo of start met een pilot waarin je boekingsflow, resources en revenue decisions concreet worden ingericht.",
  label = "Plan demo"
}: {
  title?: string;
  copy?: string;
  label?: string;
}) {
  return <CtaSection title={title} copy={copy} primary={{ label, href: siteConfig.email }} secondary={{ label: "Bekijk demo", href: "/demo" }} />;
}
