import { siteConfig } from "@/lib/marketing/site-config";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description
      }}
    />
  );
}

export function SoftwareJsonLd({ url, description }: { url: string; description: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: siteConfig.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url,
        description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }
      }}
    />
  );
}
