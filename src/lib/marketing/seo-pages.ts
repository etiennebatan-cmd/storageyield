import type { Metadata } from "next";
import { siteConfig } from "@/lib/marketing/site-config";

export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  subheadline: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  intro: string;
  modules: Array<{ title: string; copy: string; status?: string }>;
  sections: Array<{ title: string; copy: string; bullets: string[] }>;
  workflow?: Array<{ title: string; copy: string }>;
  comparison?: { leftTitle: string; rightTitle: string; rows: Array<{ label: string; left: string; right: string }> };
  related: Array<{ href: string; label: string }>;
  faqs: SeoFaq[];
};

export function pageUrl(path: string) {
  return `${siteConfig.url}${path}`;
}

export function metadataForPage(page: SeoPage): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: pageUrl(page.slug) },
    openGraph: {
      title: page.title,
      description: page.description,
      url: pageUrl(page.slug),
      siteName: siteConfig.name,
      locale: "nl_BE",
      type: "website"
    }
  };
}

const beneluxProof = [
  { title: "Taal-first", copy: "Ontworpen voor Nederlands, Frans en Engels in één commerciële flow.", status: "Benelux" },
  { title: "Lokale betaalflows", copy: "Voorbereid op iDEAL, Bancontact, SEPA en kaartbetalingen in de roadmap.", status: "Roadmap" },
  { title: "E-facturatie readiness", copy: "Datamodel en workflowdenken rond btw, B2B/B2C en PEPPOL-ready processen.", status: "Voorbereid" },
  { title: "Hybride resources", copy: "Units, garageboxen, containers, parking en business storage in één resource-logica.", status: "Pilot" }
];

const revenueModules = [
  { title: "Decision Inbox", copy: "Prijs-, follow-up-, campagne- en discountbeslissingen met bewijs en verwachte impact.", status: "Live MVP" },
  { title: "Market Radar", copy: "Operator-geselecteerde concurrenten en handmatig geverifieerde prijsobservaties.", status: "Live MVP" },
  { title: "Booking Conversion", copy: "Nieuwe aanvragen worden gescoord op urgentie, waarde en conversierisico.", status: "Live MVP" },
  { title: "Impact Report", copy: "Goedgekeurde beslissingen, boekingsconversies en prijswijzigingen worden zichtbaar.", status: "Live MVP" }
];

export const seoPages: Record<string, SeoPage> = {
  "/self-storage-software": {
    slug: "/self-storage-software",
    title: "Self-storage software voor operators | StorageYield",
    description: "Benelux-native self-storage software voor reserveringen, resources, workflows en revenue intelligence.",
    eyebrow: "Self-storage software",
    h1: "Self-storage software voor moderne opslagoperators",
    subheadline: "Beheer reserveringen, klanten, resources, prijzen en omzetbeslissingen vanuit één Benelux-native platform.",
    primaryKeyword: "self storage software",
    secondaryKeywords: ["selfstorage software", "self storage beheersoftware", "opslagruimte software"],
    ctaLabel: "Laat je opslaglocatie analyseren",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Bekijk demo",
    secondaryCtaHref: "/demo",
    intro: "Veel kleine operators werken met spreadsheets, statische websites en losse betaal- of toegangsprocessen. StorageYield brengt de commerciële laag samen: boekbaar worden, aanvragen opvolgen, resources beheren en betere omzetbeslissingen nemen.",
    modules: [
      { title: "Hosted booking page", copy: "Maak een bestaande website boekbaar met een publieke reserveringspagina, knop of iframe.", status: "Live MVP" },
      { title: "Resource management", copy: "Beheer unit types, units/resources, beschikbaarheid, tarieven en status zonder een volledig PMS te vervangen.", status: "Live MVP" },
      { title: "Customer journey", copy: "Van aanvraag naar reservering, contactmoment, conversie en impactrapport.", status: "Live MVP" },
      ...beneluxProof,
      ...revenueModules
    ],
    sections: [
      {
        title: "Wat is self-storage software?",
        copy: "Self-storage software helpt een operator om opslagresources, klanten, reserveringen en commerciële workflows te beheren. Voor Benelux-locaties gaat het niet alleen om units administreren, maar ook om lokale taal, betaal- en facturatieverwachtingen.",
        bullets: ["Online reserveringen per resource type", "Klant- en aanvraagopvolging", "Prijzen, bezetting en omzetbeslissingen", "Voorbereid op lokale betaal- en facturatieworkflows"]
      },
      {
        title: "Meer dan spreadsheets of een statische website",
        copy: "Een statische website kan leads opleveren, maar mist vaak beschikbaarheid, prijscontext en follow-up. StorageYield vult die commerciële laag aan zonder dat een operator meteen alles hoeft te migreren.",
        bullets: ["Hosted booking page zonder website rebuild", "Booking Conversion pipeline", "Data Health voor ontbrekende setup", "Decision Inbox voor wekelijkse omzetbeslissingen"]
      },
      {
        title: "Benelux-native vanaf de positionering",
        copy: "De roadmap is afgestemd op Nederlandse, Belgische en Luxemburgse operators: meertalige boeking, iDEAL/Bancontact/SEPA-ready flows en PEPPOL/e-facturatie readiness waar relevant.",
        bullets: ["Nederlands, Frans en Engels als uitgangspunt", "iDEAL/Bancontact/SEPA als roadmap", "B2B/B2C en btw-logica in de setup", "Onbemande locatieflows als kernscenario"]
      }
    ],
    comparison: {
      leftTitle: "Generieke PMS",
      rightTitle: "StorageYield",
      rows: [
        { label: "Focus", left: "Operationele administratie", right: "Boekingen, resources en omzetbeslissingen" },
        { label: "Website", left: "Vaak volledige site of aparte module", right: "Hosted booking page voor bestaande sites" },
        { label: "Revenue", left: "Rapporten en tabellen", right: "Decision Inbox met bewijs en impact" },
        { label: "Benelux", left: "Afhankelijk van configuratie", right: "Benelux-taal, betaal- en compliance-roadmap centraal" }
      ]
    },
    related: [
      { href: "/onbemande-self-storage-software", label: "Onbemande workflows" },
      { href: "/opslagruimte-reserveringssysteem", label: "Online reserveringen" },
      { href: "/self-storage-facturatie", label: "Facturatie & betalingen" },
      { href: "/self-storage-prijsoptimalisatie", label: "Prijsoptimalisatie" },
      { href: "/stora-alternatief", label: "Stora alternatief" }
    ],
    faqs: [
      { question: "Wat is self-storage software?", answer: "Software om reserveringen, klanten, resources, prijzen en workflows voor opslaglocaties te beheren." },
      { question: "Is StorageYield een PMS?", answer: "StorageYield kan basisresources beheren, maar de kern is de commerciële laag: online boekingen, conversie en revenue intelligence bovenop of naast bestaande tools." },
      { question: "Werkt StorageYield met bestaande websites?", answer: "Ja. De MVP ondersteunt een hosted booking page die je kunt linken of embedden zonder volledige website rebuild." },
      { question: "Is dit geschikt voor kleine operators?", answer: "Ja. De pilot is juist ontworpen voor onafhankelijke operators die snel online boekbaar willen worden." },
      { question: "Ondersteunt StorageYield iDEAL of Bancontact?", answer: "Niet als live betaalautomatisering in de MVP. De architectuur en roadmap zijn voorbereid op iDEAL, Bancontact en SEPA-workflows." },
      { question: "Kan ik starten zonder mijn huidige systeem te vervangen?", answer: "Ja. StorageYield kan als commerciële laag naast je huidige administratie starten." }
    ]
  },
  "/onbemande-self-storage-software": {
    slug: "/onbemande-self-storage-software",
    title: "Onbemande self-storage software | StorageYield",
    description: "Ontwerp zero-touch move-in workflows voor onbemande opslaglocaties in de Benelux.",
    eyebrow: "Onbemande workflows",
    h1: "Software voor onbemande self-storage locaties",
    subheadline: "Ontwerp een move-in flow waarbij klanten online reserveren, gegevens invullen, contracten afwerken en toegang krijgen met minimale handmatige tussenkomst.",
    primaryKeyword: "onbemande self storage",
    secondaryKeywords: ["opslagruimte automatiseren", "self storage automatiseren", "zero-touch move-in"],
    ctaLabel: "Bekijk zero-touch workflow",
    ctaHref: "/demo",
    secondaryCtaLabel: "Bespreek pilot",
    secondaryCtaHref: siteConfig.email,
    intro: "Hoge loonkosten en locaties zonder permanente balie maken onbemande workflows aantrekkelijk. StorageYield structureert de commerciële en operationele stappen zodat operators uitzonderingen zien in plaats van elke aanvraag handmatig te behandelen.",
    modules: [
      { title: "Online reservering", copy: "Klanten kiezen een resource, laten contactgegevens achter en komen in de Booking Conversion pipeline.", status: "Live MVP" },
      { title: "Contractstap", copy: "Digitale contracten en e-signature zijn roadmap; de MVP houdt de workflow voorbereid.", status: "Roadmap" },
      { title: "Betaalstap", copy: "Bancontact, iDEAL, SEPA en kaartbetalingen worden als Benelux-roadmap behandeld.", status: "Voorbereid" },
      { title: "Toegangsstap", copy: "Access-control integraties zijn niet live; de MVP ondersteunt readiness en handmatige fallback.", status: "Roadmap" }
    ],
    workflow: [
      { title: "1. Reserveren", copy: "Klant kiest unit/resource en gewenste move-in datum." },
      { title: "2. Gegevens", copy: "Klanttype, contactgegevens en bericht worden vastgelegd." },
      { title: "3. Contract", copy: "Roadmap voor digitale contracten, ID-check en audit trail." },
      { title: "4. Betaling", copy: "Roadmap voor lokale betaalmethodes en periodieke facturatie." },
      { title: "5. Toegang", copy: "Roadmap voor PIN, QR, mobile unlock of hardware-integratie." }
    ],
    sections: [
      {
        title: "Het onbemande probleem in de Benelux",
        copy: "Veel locaties hebben geen fulltime personeel, maar klanten verwachten wel directe bevestiging, duidelijke prijsinformatie en snelle toegang.",
        bullets: ["Geen permanente balie", "Meertalige klanten", "Lokale betaalverwachtingen", "Snelle follow-up nodig"]
      },
      {
        title: "Exception queue in plaats van handwerk",
        copy: "Het doel is niet om alles blind te automatiseren. Het doel is om normale aanvragen te stroomlijnen en uitzonderingen zichtbaar te maken.",
        bullets: ["Ontbrekende gegevens", "Betaling nog niet bevestigd", "Geen passende unit beschikbaar", "Handmatige toegang nodig"]
      },
      {
        title: "Voorzichtig over roadmap",
        copy: "StorageYield claimt geen live itsme-, betaal- of access-control integraties in de MVP. De pilot maakt de workflow meetbaar en klaar voor integraties.",
        bullets: ["itsme/ID-verificatie roadmap", "Digitale contracten roadmap", "Access integraties roadmap", "Handmatige fallback blijft mogelijk"]
      }
    ],
    related: [
      { href: "/self-storage-toegangscontrole", label: "Toegangscontrole" },
      { href: "/digitaal-contract-opslagruimte", label: "Digitale contracten" },
      { href: "/self-storage-facturatie", label: "Facturatie & betalingen" }
    ],
    faqs: [
      { question: "Is zero-touch move-in volledig live?", answer: "Nee. De MVP ondersteunt de boekings- en opvolgingslaag. Contracten, betalingen en toegang zijn voorbereid als roadmap of pilotintegratie." },
      { question: "Kan een operator handmatig blijven ingrijpen?", answer: "Ja. De workflow is ontworpen met uitzonderingen en handmatige fallback." },
      { question: "Werkt dit voor locaties zonder balie?", answer: "Dat is een kernscenario: online aanvragen, duidelijke next steps en later integraties voor betaling en toegang." }
    ]
  },
  "/opslagruimte-reserveringssysteem": {
    slug: "/opslagruimte-reserveringssysteem",
    title: "Reserveringssysteem voor opslagruimte | StorageYield",
    description: "Maak je opslaglocatie online boekbaar met een hosted reserveringspagina voor units, garageboxen en containers.",
    eyebrow: "Online reserveringen",
    h1: "Online reserveringssysteem voor opslagruimte",
    subheadline: "Geef je statische website een boekbare reserveringsflow zonder volledige website rebuild.",
    primaryKeyword: "opslagruimte reserveringssysteem",
    secondaryKeywords: ["self storage reserveringssysteem", "opslagruimte online reserveren", "boekingssysteem opslagruimte"],
    ctaLabel: "Maak je opslaglocatie boekbaar",
    ctaHref: "/demo",
    secondaryCtaLabel: "Plan demo",
    secondaryCtaHref: siteConfig.email,
    intro: "Een website met enkel contactformulier verliest intentie. StorageYield geeft operators een hosted booking page, widget of link waarmee klanten per unit/resource type een aanvraag kunnen starten.",
    modules: [
      { title: "Publieke booking page", copy: "Een URL per facility met unit types, prijzen en beschikbaarheid.", status: "Live MVP" },
      { title: "Embed of knop", copy: "Gebruik een knop, iframe of QR-code om een bestaande website boekbaar te maken.", status: "Live MVP" },
      { title: "Booking pipeline", copy: "Aanvragen stromen door naar Booking Conversion met lead score en next action.", status: "Live MVP" },
      { title: "Vraagdata", copy: "Reserveringen voeden demand signals en prijsbeslissingen.", status: "Live MVP" }
    ],
    sections: [
      { title: "Statische websites verliezen vraag", copy: "Klanten vergelijken online en verwachten prijs, beschikbaarheid en directe reservering. Een contactformulier voelt traag.", bullets: ["Minder frictie bij mobiele bezoekers", "Unit type en move-in datum direct bekend", "Minder handmatige e-mail heen-en-weer", "Meetbare vraag per grootte/resource"] },
      { title: "Hosted booking page", copy: "Operators kunnen starten zonder rebuild. Link vanuit website, Google Business Profile, e-mailhandtekening of QR-code op de locatie.", bullets: ["Public URL", "Button of iframe", "QR-code voor terrein of flyers", "Google Business Profile link"] },
      { title: "Van aanvraag naar omzetbeslissing", copy: "Elke aanvraag telt mee voor lead scoring, demand signals en Decision Inbox items.", bullets: ["Lead score", "Follow-up verlies", "Vraag per unit type", "Impact na conversie"] }
    ],
    related: [
      { href: "/self-storage-software", label: "Self-storage software" },
      { href: "/onbemande-self-storage-software", label: "Onbemande workflows" },
      { href: "/self-storage-prijsoptimalisatie", label: "Prijsoptimalisatie" }
    ],
    faqs: [
      { question: "Moet ik mijn website vervangen?", answer: "Nee. De hosted booking page kan als link, knop of iframe naast je bestaande site werken." },
      { question: "Kan dit voor garageboxen of containers?", answer: "Ja. De resource-logica is geschikt voor units, garageboxen, containers en hybride opslag." },
      { question: "Wordt betaling al automatisch verwerkt?", answer: "Niet in de MVP. Lokale betaalflows zijn onderdeel van de Benelux-roadmap." }
    ]
  },
  "/self-storage-toegangscontrole": {
    slug: "/self-storage-toegangscontrole",
    title: "Self-storage toegangscontrole workflows | StorageYield",
    description: "Bereid je opslaglocatie voor op digitale toegang, toegangscodes en unmanned move-in workflows.",
    eyebrow: "Access workflow readiness",
    h1: "Toegangsworkflows voor self-storage en opslaglocaties",
    subheadline: "Bereid je locatie voor op digitale toegang, toegangscodes, mobiele toegang en unmanned workflows.",
    primaryKeyword: "self storage toegangscontrole",
    secondaryKeywords: ["opslagruimte toegangscontrole", "automatische toegang opslagruimte", "self storage toegangscode"],
    ctaLabel: "Bespreek toegangsworkflow",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Bekijk onbemande flow",
    secondaryCtaHref: "/onbemande-self-storage-software",
    intro: "Toegangscontrole is vaak de stap die onbemande opslag complex maakt. StorageYield positioneert toegang als workflow: reserveren, betalen, toegang activeren, bij achterstand pauzeren en bij move-out intrekken.",
    modules: [
      { title: "Access workflow", copy: "Koppel toegangsstatus aan boeking, betaling en move-out logica.", status: "Workflow" },
      { title: "Hardware-agnostisch", copy: "Geen lock-in claim: integraties worden per pilot en hardware onderzocht.", status: "Roadmap" },
      { title: "Fallback", copy: "Noodtoegang, override en audit trail blijven belangrijk.", status: "Pilot" },
      { title: "Operator queue", copy: "Zicht op aanvragen waar toegang nog handmatig moet worden bevestigd.", status: "Live MVP" }
    ],
    sections: [
      { title: "Waarom toegang cruciaal is", copy: "Bij onbemande locaties bepaalt toegang of online boekingen echt schaalbaar worden.", bullets: ["Toegang na bevestigde reservering", "Suspensie bij non-payment", "Intrekken bij move-out", "Audit trail voor support"] },
      { title: "Huidige MVP-status", copy: "StorageYield claimt geen live hardware-integraties. De MVP helpt de workflow ontwerpen en maakt handmatige stappen zichtbaar.", bullets: ["Manual/access mock provider", "Access readiness checklist", "Booking status als trigger", "Integraties op aanvraag/roadmap"] },
      { title: "Roadmap opties", copy: "Afhankelijk van locatie en hardware kan de roadmap richting PIN, QR, mobile unlock of Europese hardware-integraties gaan.", bullets: ["PIN-code", "QR-code", "Mobile unlock", "Hardware-integraties"] }
    ],
    related: [
      { href: "/onbemande-self-storage-software", label: "Onbemande self-storage" },
      { href: "/digitaal-contract-opslagruimte", label: "Digitale contracten" },
      { href: "/self-storage-facturatie", label: "Betaalflows" }
    ],
    faqs: [
      { question: "Heeft StorageYield live toegangscontrole?", answer: "Nee, niet als standaard MVP-feature. Toegangscontrole is een readiness- en roadmapgebied voor pilots." },
      { question: "Kan ik mijn bestaande hardware behouden?", answer: "Het uitgangspunt is hardware-agnostisch, maar integraties worden per pilot beoordeeld." },
      { question: "Waarom staat dit dan op de site?", answer: "Omdat onbemande storage zonder toegangsworkflow niet compleet is; StorageYield maakt deze workflow expliciet." }
    ]
  },
  "/self-storage-facturatie": {
    slug: "/self-storage-facturatie",
    title: "Self-storage facturatie & betalingen | StorageYield",
    description: "Benelux-ready facturatie- en betaalflows voor self-storage, met iDEAL/Bancontact/SEPA en PEPPOL roadmap.",
    eyebrow: "Facturatie & betalingen",
    h1: "Facturatie en betaalflows voor Benelux self-storage",
    subheadline: "Ontwerp je opslagsoftware rond lokale betaalmethodes, terugkerende facturatie, B2B/B2C-logica en PEPPOL-ready workflows.",
    primaryKeyword: "self storage facturatie",
    secondaryKeywords: ["opslagruimte facturatie", "self storage iDEAL", "self storage Bancontact", "Peppol self storage"],
    ctaLabel: "Plan gesprek over facturatie",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Bekijk België pagina",
    secondaryCtaHref: "/self-storage-software-belgie",
    intro: "US/UK betaal- en facturatielogica past niet vanzelf op Belgische en Nederlandse operators. StorageYield positioneert facturatie als lokale workflow: betaalmethode, btw, B2B/B2C, herinneringen en e-facturatie-readiness.",
    modules: [
      { title: "iDEAL readiness", copy: "Ontworpen om Nederlandse betaalflows te ondersteunen in de roadmap.", status: "Roadmap" },
      { title: "Bancontact readiness", copy: "Voorbereid op Belgische betaalvoorkeuren zonder te claimen dat verwerking live is.", status: "Roadmap" },
      { title: "SEPA en bankoverschrijving", copy: "Relevant voor terugkerende opslagfacturen en zakelijke klanten.", status: "Roadmap" },
      { title: "PEPPOL-ready data", copy: "Voorbereid op B2B e-facturatie-denken, niet verkocht als live PEPPOL-koppeling.", status: "Voorbereid" }
    ],
    sections: [
      { title: "Waarom lokale betalingen ertoe doen", copy: "Klanten verwachten bekende betaalmethodes. Operators verwachten duidelijke factuurstatus en opvolging.", bullets: ["iDEAL voor Nederland", "Bancontact voor België", "SEPA voor recurring workflows", "Bankoverschrijving en B2B"] },
      { title: "Btw, B2B/B2C en e-facturatie", copy: "De Benelux vraagt nette data rond klanttype, btw, factuuradres en zakelijke facturatie. PEPPOL is roadmap/readiness, geen live claim.", bullets: ["B2B/B2C-logica", "Btw-velden", "PEPPOL-ready roadmap", "Herinneringen en achterstandssignalen"] },
      { title: "Revenue intelligence uit betaaldata", copy: "Achterstand, discounts en betaalgedrag worden signalen voor opvolging en omzetbeslissingen.", bullets: ["Arrears risk", "Discount leakage", "Impact Report", "Collections decisions"] }
    ],
    related: [
      { href: "/self-storage-software-nederland", label: "Nederland" },
      { href: "/self-storage-software-belgie", label: "België" },
      { href: "/digitaal-contract-opslagruimte", label: "Digitale contracten" }
    ],
    faqs: [
      { question: "Zijn iDEAL en Bancontact live?", answer: "Nee. StorageYield beschrijft hier de roadmap en architectuurvoorbereiding voor Benelux betaalflows." },
      { question: "Is PEPPOL live?", answer: "Nee. De MVP is PEPPOL-ready gepositioneerd, maar geen live PEPPOL-facturatieplatform." },
      { question: "Waarom toch facturatie vermelden?", answer: "Omdat facturatie, betaalstatus en achterstand direct invloed hebben op onbemande workflows en revenue intelligence." }
    ]
  },
  "/digitaal-contract-opslagruimte": {
    slug: "/digitaal-contract-opslagruimte",
    title: "Digitaal contract opslagruimte | StorageYield",
    description: "Roadmap voor digitale contracten, ID-verificatie en meertalige opslagcontracten in België, Nederland en Luxemburg.",
    eyebrow: "Contract & identiteit",
    h1: "Digitale contracten en ID-verificatie voor opslagruimte",
    subheadline: "Maak move-ins schaalbaar met taal- en jurisdictielogica voor België, Nederland en Luxemburg.",
    primaryKeyword: "digitaal contract opslagruimte",
    secondaryKeywords: ["huurcontract opslagruimte digitaal", "digitaal ondertekenen opslagruimte", "ID verificatie opslagruimte", "itsme self storage"],
    ctaLabel: "Bekijk contractworkflow",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Onbemande workflows",
    secondaryCtaHref: "/onbemande-self-storage-software",
    intro: "Contracten zijn in de Benelux zelden one-size-fits-all. Operators hebben taalkeuze, klanttype, jurisdictie en audit trail nodig voordat move-ins echt schaalbaar worden.",
    modules: [
      { title: "Meertalige contractlogica", copy: "Nederlands, Frans en Engels als uitgangspunt; Duits later relevant voor Luxemburg.", status: "Roadmap" },
      { title: "Jurisdictievelden", copy: "Vlaanderen, Brussel, Wallonië, Nederland en Luxemburg vragen andere voorkeuren.", status: "Voorbereid" },
      { title: "ID-verificatie", copy: "itsme en ID-provider workflows zijn roadmap, met handmatige fallback in pilot.", status: "Roadmap" },
      { title: "Audit trail", copy: "Bewijs van akkoord, datum, versie en klantgegevens als ontwerpprincipe.", status: "Roadmap" }
    ],
    sections: [
      { title: "Waarom contracten lastig zijn", copy: "Een opslagcontract raakt taal, identiteit, klanttype, looptijd en toegang. Bij onbemande locaties wordt dit een kernworkflow.", bullets: ["Taalvoorkeur", "B2B/B2C", "ID-check", "Bewijs van ondertekening"] },
      { title: "itsme en e-signature als roadmap", copy: "StorageYield claimt geen live itsme- of e-signature-integratie. De pilot kan wel de stappen en uitzonderingen modelleren.", bullets: ["itsme roadmap", "ID-provider roadmap", "E-signature roadmap", "Manual fallback"] },
      { title: "GDPR en audit trail", copy: "Contractdata moet zorgvuldig worden behandeld. De MVP positioneert dit als workflow- en datamodelvereiste.", bullets: ["Minimale data", "Versiebeheer", "Toestemming en timestamp", "Support audit trail"] }
    ],
    related: [
      { href: "/onbemande-self-storage-software", label: "Zero-touch move-in" },
      { href: "/self-storage-toegangscontrole", label: "Toegangscontrole" },
      { href: "/self-storage-facturatie", label: "Facturatie" }
    ],
    faqs: [
      { question: "Is digitaal ondertekenen live?", answer: "Niet als standaard MVP-feature. Het is onderdeel van de roadmap voor pilots." },
      { question: "Ondersteunt StorageYield itsme?", answer: "Niet live. itsme wordt behandeld als mogelijke ID-verificatie-roadmap voor België." },
      { question: "Kan ik handmatig blijven werken?", answer: "Ja. De pilot kan contractstappen zichtbaar maken zonder alles meteen te automatiseren." }
    ]
  },
  "/self-storage-prijsoptimalisatie": {
    slug: "/self-storage-prijsoptimalisatie",
    title: "Self-storage prijsoptimalisatie | StorageYield",
    description: "Revenue intelligence voor self-storage: prijsbeslissingen, competitor radar, lead scoring en impactrapportage.",
    eyebrow: "Revenue intelligence",
    h1: "Prijsoptimalisatie en revenue intelligence voor self-storage",
    subheadline: "Gebruik bezetting, vraag, concurrentieprijzen en boekingsdata om betere prijs- en omzetbeslissingen te nemen.",
    primaryKeyword: "self storage prijsoptimalisatie",
    secondaryKeywords: ["self storage revenue management", "self storage yield management", "opslagruimte prijsstrategie", "self storage omzet verhogen"],
    ctaLabel: "Laat omzetkansen analyseren",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Bekijk demo",
    secondaryCtaHref: "/demo",
    intro: "Een PMS bewaart data. StorageYield interpreteert die data als concrete beslissingen: verhoog nieuwe boekingsprijzen, houd prijs vast, herstel discounts, volg leads op of lanceer een campagne.",
    modules: revenueModules,
    sections: [
      { title: "Decision Inbox", copy: "Elke beslissing bevat vraag, bewijs, risico, confidence, next step en verwachte maandimpact.", bullets: ["New-customer street-rate beslissingen", "Hold-price beslissingen", "Rent-review kandidaten", "Discount leakage", "Campaign decisions"] },
      { title: "Competitor Radar", copy: "Operators kiezen zelf welke concurrenten meetellen. Benchmark-only en ignored blijven zichtbaar maar sturen geen prijsbeslissing.", bullets: ["Handmatige prijsobservaties", "Direct/partial/benchmark/ignored", "Stale data waarschuwingen", "Concurrenten gebruikt in bewijs"] },
      { title: "Voorzichtig met bestaande huurders", copy: "Prijswijzigingen gelden standaard voor nieuwe boekingen. Bestaande huurder reviews zijn kandidaten en moeten juridisch/contractueel kunnen.", bullets: ["Nieuwe klanten eerst", "Rent-review candidates", "Geen automatische tenant increases", "Impact Report na goedkeuring"] }
    ],
    related: [
      { href: "/self-storage-software", label: "Self-storage software" },
      { href: "/opslagruimte-reserveringssysteem", label: "Online reserveringen" },
      { href: "/stora-alternatief", label: "Vergelijk met Stora" }
    ],
    faqs: [
      { question: "Is dit AI?", answer: "Nee. De MVP gebruikt deterministische regels op basis van bezetting, vraag, concurrentiedata, discounts en booking status." },
      { question: "Verhoogt StorageYield automatisch prijzen?", answer: "Nee. De operator keurt beslissingen goed. Prijswijzigingen gelden standaard voor nieuwe klanten." },
      { question: "Hoe werkt competitor tracking?", answer: "De operator kiest concurrenten en voert handmatig geverifieerde prijsobservaties in tijdens de pilot." }
    ]
  },
  "/garagebox-verhuur-software": {
    slug: "/garagebox-verhuur-software",
    title: "Garagebox verhuur software | StorageYield",
    description: "Resource-first software voor garagebox verhuur: reserveringen, klanten, toegang readiness en revenue intelligence.",
    eyebrow: "Garagebox verhuur",
    h1: "Garagebox verhuur software voor Benelux-operators",
    subheadline: "Beheer garageboxen, reserveringen, klanten, betalingen en toegangsworkflows met een resource-first systeem.",
    primaryKeyword: "garagebox verhuur software",
    secondaryKeywords: ["garagebox software", "garagebox beheer software", "garagebox huren software"],
    ctaLabel: "Bekijk garagebox workflow",
    ctaHref: "/demo",
    secondaryCtaLabel: "Plan pilot",
    secondaryCtaHref: siteConfig.email,
    intro: "Garageboxen zijn niet altijd klassieke self-storage units. Ze kunnen opslag, parking, hobbyruimte of zakelijke ruimte zijn. StorageYield behandelt ze als resources met beschikbaarheid, prijs, klanttype en omzetbeslissing.",
    modules: [
      { title: "Resource-first", copy: "Garageboxen, units, parking en mixed-use resources kunnen dezelfde boekingslogica volgen.", status: "Live MVP" },
      { title: "Online reservering", copy: "Maak boxen boekbaar via hosted booking page of bestaande website.", status: "Live MVP" },
      { title: "Access workflow", copy: "Voorbereid op toegangsstappen, handmatige fallback en toekomstige integraties.", status: "Roadmap" },
      { title: "Revenue decisions", copy: "Bezetting, vraag en concurrentie sturen prijs- of campagnebeslissingen.", status: "Live MVP" }
    ],
    sections: [
      { title: "Garageboxen vragen andere softwarelogica", copy: "Een garagebox kan opslag, parking of business storage zijn. Daarom is resource-first belangrijker dan alleen unit management.", bullets: ["Boxgrootte en type", "Beschikbaarheid per resource", "Klanttype", "Toegang en gebruiksregels"] },
      { title: "Van vraag naar conversie", copy: "Nieuwe aanvragen komen in Booking Conversion met lead score en next action.", bullets: ["Telefonische follow-up", "Zakelijke leads prioriteren", "Beschikbare box reserveren", "Conversie zichtbaar in Impact Report"] },
      { title: "Prijs en bezetting", copy: "Garageboxprijzen verschillen lokaal sterk. StorageYield helpt handmatig concurrenten volgen en beslissingen onderbouwen.", bullets: ["Market Radar", "Prijsobservaties", "Hold/raise decisions", "Discount leakage"] }
    ],
    related: [
      { href: "/self-storage-software", label: "Self-storage software" },
      { href: "/opslagruimte-reserveringssysteem", label: "Reserveringssysteem" },
      { href: "/self-storage-prijsoptimalisatie", label: "Prijsoptimalisatie" }
    ],
    faqs: [
      { question: "Is StorageYield alleen voor self-storage?", answer: "Nee. De resource-logica is ook geschikt voor garageboxen en hybride opslaglocaties." },
      { question: "Kan ik garageboxen online reserverbaar maken?", answer: "Ja. De hosted booking page kan boxen als resource type tonen." },
      { question: "Zijn betalingen live?", answer: "Niet in de MVP. Lokale betaalflows staan op de Benelux-roadmap." }
    ]
  },
  "/container-opslag-software": {
    slug: "/container-opslag-software",
    title: "Container opslag software | StorageYield",
    description: "Software voor containeropslag en containerverhuur met reserveringen, resource management en omzetbeslissingen.",
    eyebrow: "Containeropslag",
    h1: "Software voor containeropslag en containerverhuur",
    subheadline: "Beheer containers als resources: beschikbaarheid, reserveringen, klanten, toegang en omzetbeslissingen.",
    primaryKeyword: "container opslag software",
    secondaryKeywords: ["container verhuur software", "container opslag beheer", "container opslag reservering"],
    ctaLabel: "Plan demo voor containeropslag",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Bekijk reserveringsflow",
    secondaryCtaHref: "/opslagruimte-reserveringssysteem",
    intro: "Containeropslag is vaak seizoensgevoeliger en business-heavy. StorageYield ondersteunt resource setup, online reserveringen en pricing intelligence zonder te doen alsof het een volledig transport- of verhuur-ERP is.",
    modules: [
      { title: "Container als resource", copy: "Containers worden behandeld als resources met status, type, prijs en availability.", status: "Live MVP" },
      { title: "Booking flow", copy: "Klanten kunnen interesse of reservering per containertype starten.", status: "Live MVP" },
      { title: "Business demand", copy: "Zakelijke leads krijgen hogere prioriteit in lead scoring.", status: "Live MVP" },
      { title: "Seasonal decisions", copy: "Seizoen en bezetting kunnen campagne- of prijsbeslissingen triggeren.", status: "Live MVP" }
    ],
    sections: [
      { title: "Hybride opslagmodel", copy: "Containeropslag zit tussen self-storage, verhuur en business storage. Daarom is flexibele resource-logica belangrijk.", bullets: ["Containertype", "Beschikbaarheid", "Zakelijk/privé klanttype", "Seizoensvraag"] },
      { title: "Boekbaar zonder nieuwe website", copy: "Gebruik een hosted booking page of link vanuit bestaande site en Google Business Profile.", bullets: ["Public URL", "Widget/iframe", "QR-code", "Booking pipeline"] },
      { title: "Pricing en occupancy decisions", copy: "Opslagcontainers kunnen onder- of overgeprijsd zijn ten opzichte van lokale vraag en concurrentie. StorageYield maakt beslissingen zichtbaar.", bullets: ["Occupancy pressure", "Lead demand", "Competitor observations", "Impact Report"] }
    ],
    related: [
      { href: "/garagebox-verhuur-software", label: "Garagebox software" },
      { href: "/self-storage-prijsoptimalisatie", label: "Prijsoptimalisatie" },
      { href: "/opslagruimte-reserveringssysteem", label: "Online reserveringen" }
    ],
    faqs: [
      { question: "Is dit containerverhuur ERP?", answer: "Nee. StorageYield focust op de commerciële laag: boekingen, resources en omzetbeslissingen." },
      { question: "Werkt het voor zakelijke klanten?", answer: "Ja. Lead scoring houdt rekening met business customers en hogere maandwaarde." },
      { question: "Kan ik later integreren met bestaande systemen?", answer: "Integraties zijn roadmap en worden per pilot bekeken." }
    ]
  },
  "/self-storage-software-nederland": {
    slug: "/self-storage-software-nederland",
    title: "Self-storage software Nederland | StorageYield",
    description: "Nederlandse self-storage software voor online reserveringen, iDEAL-ready workflows en revenue intelligence.",
    eyebrow: "Nederland",
    h1: "Self-storage software voor Nederlandse operators",
    subheadline: "Maak je locatie boekbaar, volg leads op en bereid workflows voor op iDEAL, SEPA en Nederlandse operationele verwachtingen.",
    primaryKeyword: "self storage software Nederland",
    secondaryKeywords: ["self storage software NL", "opslagruimte software Nederland"],
    ctaLabel: "Start Nederlandse pilot",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Bekijk demo",
    secondaryCtaHref: "/demo",
    intro: "Nederlandse operators hebben vaak statische websites, lokale concurrentiedruk en klanten die iDEAL verwachten. StorageYield start met booking, resource setup en revenue intelligence, met lokale betaalflows als roadmap.",
    modules: [
      { title: "Nederlandstalige booking flow", copy: "Heldere boekingstaal en mobiele flow voor particuliere en zakelijke klanten.", status: "Live MVP" },
      { title: "iDEAL readiness", copy: "Ontworpen om iDEAL-workflows te ondersteunen in de roadmap.", status: "Roadmap" },
      { title: "KVK/btw velden", copy: "Zakelijke klantdata hoort in de setup voor facturatie-readiness.", status: "Voorbereid" },
      { title: "Competitor tracking", copy: "Volg geselecteerde concurrenten handmatig in Market Radar.", status: "Live MVP" }
    ],
    sections: [
      { title: "Nederlandse marktverwachtingen", copy: "Klanten willen mobiel reserveren, duidelijke prijzen zien en bekende betaalmethodes gebruiken.", bullets: ["iDEAL roadmap", "SEPA voor recurring", "Nederlandse copy", "Google Business link"] },
      { title: "Van statische website naar boekbaar", copy: "Start met een hosted booking page zonder volledige websitevervanging.", bullets: ["Link of iframe", "Booking Conversion", "Lead score", "Impact Report"] },
      { title: "Revenue decisions per week", copy: "Vraag, bezetting, discounts en concurrentie worden omgezet in goedkeuringsklare beslissingen.", bullets: ["Decision Inbox", "Pricing Lab", "Market Radar", "Impact Report"] }
    ],
    related: [
      { href: "/self-storage-software", label: "Self-storage software" },
      { href: "/self-storage-facturatie", label: "Facturatie & betalingen" },
      { href: "/opslagruimte-reserveringssysteem", label: "Reserveringssysteem" }
    ],
    faqs: [
      { question: "Is iDEAL al live?", answer: "Nee. iDEAL is roadmap/readiness, niet live betaalverwerking in de MVP." },
      { question: "Kan ik starten met mijn bestaande site?", answer: "Ja. Gebruik een hosted booking page of link." },
      { question: "Is StorageYield geschikt voor kleine operators?", answer: "Ja, de concierge pilot is juist bedoeld voor kleinere onafhankelijke locaties." }
    ]
  },
  "/self-storage-software-belgie": {
    slug: "/self-storage-software-belgie",
    title: "Self-storage software België | StorageYield",
    description: "Belgische self-storage software met NL/FR workflows, Bancontact readiness, PEPPOL roadmap en revenue intelligence.",
    eyebrow: "België",
    h1: "Self-storage software voor Belgische operators",
    subheadline: "Ondersteun Nederlandstalige, Franstalige en Engelstalige klanten met boekbare opslagflows en revenue intelligence.",
    primaryKeyword: "self storage software België",
    secondaryKeywords: ["opslagruimte software België", "self storage software Vlaanderen"],
    ctaLabel: "Start Belgische pilot",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Bekijk demo",
    secondaryCtaHref: "/demo",
    intro: "Belgische operators hebben taalcomplexiteit, Bancontact-verwachtingen, btw-logica en komende e-facturatievragen. StorageYield start praktisch met booking en revenue intelligence, met compliance-readiness als roadmap.",
    modules: [
      { title: "NL/FR/EN-first", copy: "Ontworpen rond meertalige klanten en Brusselse bilingualiteit.", status: "Benelux" },
      { title: "Bancontact readiness", copy: "Bancontact en SEPA workflows zijn roadmap, niet live betaalclaim.", status: "Roadmap" },
      { title: "PEPPOL/e-facturatie", copy: "Voorbereid op Belgische B2B e-facturatie-denkrichting.", status: "Voorbereid" },
      { title: "Revenue intelligence", copy: "Decision Inbox, Market Radar en Impact Report voor lokale omzetbeslissingen.", status: "Live MVP" }
    ],
    sections: [
      { title: "Belgische opslagoperators hebben lokale nuances", copy: "Vlaanderen, Brussel en Wallonië vragen taalkeuze, klanttype en facturatiecontext.", bullets: ["Nederlands/French/English", "Brusselse taalcontext", "Btw en B2B/B2C", "Bancontact roadmap"] },
      { title: "Onbemande locaties", copy: "Veel Belgische locaties willen met minder baliewerk werken. StorageYield maakt booking, follow-up en access readiness zichtbaar.", bullets: ["Hosted booking page", "Booking Conversion", "Contract roadmap", "Access workflow readiness"] },
      { title: "Concurrentie en prijsbeslissingen", copy: "Operators kiezen zelf welke concurrenten meetellen. StorageYield zet die prijsobservaties om in bewijs voor beslissingen.", bullets: ["Market Radar", "Direct/partial/benchmark/ignored", "Pricing Lab", "Impact Report"] }
    ],
    related: [
      { href: "/self-storage-facturatie", label: "Facturatie België" },
      { href: "/digitaal-contract-opslagruimte", label: "Digitale contracten" },
      { href: "/self-storage-prijsoptimalisatie", label: "Revenue intelligence" }
    ],
    faqs: [
      { question: "Is PEPPOL live?", answer: "Nee. StorageYield spreekt over PEPPOL-ready roadmap en datamodelvoorbereiding." },
      { question: "Ondersteunt StorageYield Frans?", answer: "De marketing en productpositionering zijn NL/FR/EN-first; volledige productlokalisatie wordt per pilot bepaald." },
      { question: "Is Bancontact live?", answer: "Nee. Bancontact is een lokale betaalflow in de roadmap." }
    ]
  },
  "/stora-alternatief": {
    slug: "/stora-alternatief",
    title: "Stora alternatief voor Benelux | StorageYield",
    description: "Een Benelux-native alternatief voor operators die booking, lokale workflows en revenue intelligence centraal willen zetten.",
    eyebrow: "Vergelijk",
    h1: "Stora alternatief voor Benelux self-storage operators",
    subheadline: "StorageYield is gebouwd voor operators die Benelux-localisatie, statische website upgrades, lokale betaalflows en revenue intelligence centraal willen zetten.",
    primaryKeyword: "Stora alternatief",
    secondaryKeywords: ["Stora Nederland", "Stora België", "Stora software alternatief"],
    ctaLabel: "Vergelijk je huidige setup",
    ctaHref: siteConfig.email,
    secondaryCtaLabel: "Bekijk demo",
    secondaryCtaHref: "/demo",
    intro: "Stora is een sterk self-storage platform. Sommige Benelux-operators zoeken daarnaast een lokale, lichtere of pilotvriendelijke aanpak die start met bestaande websites, meertalige workflows en concrete omzetbeslissingen.",
    modules: [
      { title: "Hosted booking link", copy: "Voor operators die hun bestaande website boekbaar willen maken.", status: "Focus" },
      { title: "Benelux roadmap", copy: "Taal, betaalflows, e-facturatie-readiness en onbemande workflows centraal.", status: "Focus" },
      { title: "Revenue decision memos", copy: "Beslissingen met bewijs, next step en impact in plaats van alleen rapportage.", status: "Focus" },
      { title: "Operator-selected competitors", copy: "Concurrenten worden gekozen door de operator, niet automatisch aangenomen.", status: "Focus" }
    ],
    sections: [
      { title: "Eerlijk vergelijken", copy: "Deze pagina is niet bedoeld om Stora af te kraken. Het verschil zit in lokale pilotfocus en Benelux-native positionering.", bullets: ["Stora is een volwassen platform", "StorageYield focust op Benelux pilots", "Bestaande websites boekbaar maken", "Revenue intelligence als kern"] },
      { title: "Waarom Benelux-localisatie telt", copy: "Nederland en België vragen andere betaal-, taal-, facturatie- en onbemande workflowkeuzes dan veel generieke markten.", bullets: ["Nederlands/Frans/Engels", "iDEAL/Bancontact/SEPA roadmap", "PEPPOL/e-facturatie readiness", "Lokale competitor intelligence"] },
      { title: "Wanneer StorageYield past", copy: "Voor onafhankelijke operators die niet meteen alles willen vervangen, maar wel online boekbaar en omzetgerichter willen worden.", bullets: ["Statische website upgrade", "Concierge pilot", "Booking Conversion", "Decision Inbox en Impact Report"] }
    ],
    comparison: {
      leftTitle: "Globaal platform",
      rightTitle: "Benelux-native aanpak",
      rows: [
        { label: "Positionering", left: "Breed self-storage platform", right: "Benelux pilotlaag voor booking en revenue" },
        { label: "Website", left: "Afhankelijk van implementatie", right: "Hosted booking link als startpunt" },
        { label: "Lokale workflows", left: "Per markt/configuratie", right: "NL/FR/EN, betaal- en e-facturatie-roadmap expliciet" },
        { label: "Revenue", left: "Rapportage en analytics", right: "Decision Inbox met operator approval" }
      ]
    },
    related: [
      { href: "/self-storage-software", label: "Self-storage software" },
      { href: "/self-storage-software-nederland", label: "Nederland" },
      { href: "/self-storage-software-belgie", label: "België" },
      { href: "/self-storage-prijsoptimalisatie", label: "Prijsoptimalisatie" }
    ],
    faqs: [
      { question: "Is StorageYield beter dan Stora?", answer: "Dat hangt af van je situatie. Stora is sterk; StorageYield focust op Benelux-localisatie, pilotsetup en revenue decision workflows." },
      { question: "Kan ik StorageYield naast een ander systeem gebruiken?", answer: "Ja. De pilot kan starten als booking- en revenue-laag naast bestaande processen." },
      { question: "Maakt StorageYield claims over Stora-features?", answer: "Nee. Deze vergelijking blijft bewust neutraal en focust op StorageYield’s eigen positionering." }
    ]
  }
};
