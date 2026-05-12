import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { pageUrl } from "@/lib/marketing/seo-pages";

const posts = {
  "hoe-verhoog-je-self-storage-omzet-met-concurrent-analyse": {
    title: "Hoe verhoog je self-storage omzet met concurrent analyse",
    excerpt: "Leer hoe je met systematische concurrent analyse je prijzen optimaliseert en meer boekingen binnenhaalt. Praktische stappen voor Nederlandse en Belgische operators.",
    date: "2026-05-10",
    readTime: "8 min lezen",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    content: `
      <p>Als self-storage operator weet je dat prijzen allesbepalend zijn voor je omzet. Maar hoe bepaal je de juiste prijs? Te hoog, en je verliest boekingen. Te laag, en je laat geld liggen.</p>

      <p>De oplossing: systematische concurrent analyse. Niet af en toe een blik werpen op concurrenten, maar een gestructureerde aanpak die je prijzen optimaliseert en je bezettingsgraad verhoogt.</p>

      <h2>Stap 1: Identificeer je echte concurrenten</h2>
      <p>Niet alle opslaglocaties zijn concurrenten. Focus op locaties binnen 10-15 km van je eigen locatie, met vergelijkbare faciliteiten.</p>

      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop" alt="Concurrenten kaart" class="w-full rounded-lg mb-6" />

      <p>Gebruik Google Maps om alle self-storage locaties in je regio te vinden. Noteer hun adressen, website URLs en zichtbare prijzen.</p>

      <h2>Stap 2: Verzamel prijsdata</h2>
      <p>Voor elke concurrent, verzamel prijzen per vierkante meter voor verschillende unit types:</p>
      <ul>
        <li>1-2 m² units</li>
        <li>3-5 m² units</li>
        <li>6+ m² units</li>
      </ul>

      <p>Belangrijk: verzamel zowel de standaard prijzen als eventuele kortingen of promoties.</p>

      <h2>Stap 3: Analyseer de markt</h2>
      <p>Vergelijk je prijzen met het gemiddelde van je concurrenten:</p>
      <ul>
        <li>Bij welke units ben je duurder?</li>
        <li>Bij welke units ben je goedkoper?</li>
        <li>Zijn er prijsverschillen tussen Nederlandse en Belgische concurrenten?</li>
      </ul>

      <h2>Stap 4: Optimaliseer je prijzen</h2>
      <p>Gebruik deze inzichten om je prijzen aan te passen:</p>
      <ul>
        <li>Verhoog prijzen waar je onder het gemiddelde zit</li>
        <li>Bied kortingen waar je boven het gemiddelde zit</li>
        <li>Test prijsveranderingen in kleine stapjes</li>
      </ul>

      <p>Met systematische concurrent analyse kun je je omzet met 15-30% verhogen, zonder je bezettingsgraad te verliezen.</p>

      <div class="bg-emerald-50 p-6 rounded-lg mt-8">
        <h3 class="text-lg font-semibold text-emerald-900 mb-2">Wil je dit automatiseren?</h3>
        <p class="text-emerald-800 mb-4">StorageYield's Market Radar doet dit werk voor je. Automatische prijs monitoring, concurrent analyse en prijsaanbevelingen.</p>
        <Link href="/demo" class="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
          Bekijk demo <span>→</span>
        </Link>
      </div>
    `,
    metaDescription: "Leer hoe systematische concurrent analyse je self-storage prijzen optimaliseert. Praktische stappen voor Nederlandse operators om omzet te verhogen.",
    keywords: ["self storage prijzen", "concurrent analyse", "prijsoptimalisatie", "self storage omzet"]
  },
  "ultieme-gids-self-storage-prijzen-nederland": {
    title: "De ultieme gids voor self-storage prijzen in Nederland",
    excerpt: "Alles wat je moet weten over prijzen per vierkante meter, seizoensinvloeden en hoe je concurrenten slaat zonder je winst te verliezen.",
    date: "2026-05-08",
    readTime: "12 min lezen",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    content: `
      <p>Prijzen zijn het hart van je self-storage business. De juiste prijs trekt klanten aan, maximaliseert je omzet en houdt je concurrenten op afstand.</p>

      <p>Maar wat is de juiste prijs? In deze gids leer je alles over self-storage prijzen in Nederland.</p>

      <h2>Gemiddelde prijzen per regio</h2>
      <p>Prijzen variëren sterk per regio in Nederland:</p>
      <ul>
        <li><strong>Amsterdam/Randstad:</strong> €2.50-€4.00 per m²/maand</li>
        <li><strong>Utrecht:</strong> €2.20-€3.50 per m²/maand</li>
        <li><strong>Rotterdam:</strong> €2.00-€3.20 per m²/maand</li>
        <li><strong>Provincies:</strong> €1.80-€2.80 per m²/maand</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=300&fit=crop" alt="Prijzen kaart Nederland" class="w-full rounded-lg mb-6" />

      <h2>Seizoensinvloeden</h2>
      <p>Self-storage heeft duidelijke seizoenspatronen:</p>
      <ul>
        <li><strong>Januari-Maart:</strong> Hoogste vraag, hoogste prijzen</li>
        <li><strong>April-Juni:</strong> Matige vraag, stabiele prijzen</li>
        <li><strong>Juli-September:</strong> Lage vraag, lagere prijzen of kortingen</li>
        <li><strong>Oktober-December:</strong> Toenemende vraag, prijsverhogingen</li>
      </ul>

      <h2>Prijzen per unit type</h2>
      <p>Kleinere units zijn relatief duurder:</p>
      <ul>
        <li>1 m²: €50-€80/maand</li>
        <li>3 m²: €120-€180/maand</li>
        <li>6 m²: €200-€300/maand</li>
        <li>10 m²: €300-€450/maand</li>
      </ul>

      <h2>Hoe concurrenten te verslaan</h2>
      <p>Gebruik data om slimmer te prijzen:</p>
      <ul>
        <li>Monitor concurrent prijzen dagelijks</li>
        <li>Bied kortingen voor langetermijncontracten</li>
        <li>Gebruik dynamic pricing voor piekperiodes</li>
      </ul>

      <p>Met de juiste prijsstrategie kun je je bezettingsgraad met 20% verhogen.</p>

      <div class="bg-blue-50 p-6 rounded-lg mt-8">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">Automatiseer je prijsoptimalisatie</h3>
        <p class="text-blue-800 mb-4">StorageYield's Pricing Lab analyseert je concurrenten en geeft prijsaanbevelingen die je omzet maximaliseren.</p>
        <Link href="/self-storage-prijsoptimalisatie" class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Leer meer <span>→</span>
        </Link>
      </div>
    `,
    metaDescription: "Complete gids voor self-storage prijzen in Nederland. Leer over regionale verschillen, seizoensinvloeden en prijsstrategieën.",
    keywords: ["self storage prijzen Nederland", "prijs per vierkante meter", "self storage tarieven", "prijsstrategie"]
  },
  "waarom-benelux-self-storage-online-boekingen-nodig-heeft": {
    title: "Waarom Benelux self-storage operators online boekingen nodig hebben",
    excerpt: "Waarom traditionele telefoonboekingen niet meer werken en hoe online systemen je bezettingsgraad met 25% verhogen.",
    date: "2026-05-05",
    readTime: "6 min lezen",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    content: `
      <p>De self-storage markt verandert. Klanten verwachten online boekingen, 24/7 beschikbaarheid en directe bevestiging.</p>

      <p>Traditionele telefoonboekingen werken niet meer. Hier is waarom online boekingen essentieel zijn voor Benelux operators.</p>

      <h2>De klant van vandaag</h2>
      <p>Moderne self-storage klanten:</p>
      <ul>
        <li>Willen direct boeken, zonder wachten</li>
        <li>Vergelijken prijzen online</li>
        <li>Willen 24/7 toegang tot informatie</li>
        <li>Verwachten digitale contracten</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop" alt="Klantreis online" class="w-full rounded-lg mb-6" />

      <h2>Voordelen van online boekingen</h2>
      <p>Online systemen bieden:</p>
      <ul>
        <li><strong>Hogere conversie:</strong> 25% meer boekingen</li>
        <li><strong>24/7 verkoop:</strong> Geen kantooruren nodig</li>
        <li><strong>Minder administratie:</strong> Automatische bevestigingen</li>
        <li><strong>Beter lead management:</strong> Geautomatiseerde follow-up</li>
      </ul>

      <h2>Wat heb je nodig?</h2>
      <p>Een goed online boekingssysteem heeft:</p>
      <ul>
        <li>Hosted booking pagina</li>
        <li>Realtime beschikbaarheid</li>
        <li>Automatische prijzen</li>
        <li>Lead capture en follow-up</li>
      </ul>

      <p>Zonder online boekingen verlies je klanten aan concurrenten die wel online zijn.</p>

      <div class="bg-purple-50 p-6 rounded-lg mt-8">
        <h3 class="text-lg font-semibold text-purple-900 mb-2">Start met online boekingen</h3>
        <p class="text-purple-800 mb-4">StorageYield's booking systeem integreert naadloos met je bestaande website en verhoogt je conversie.</p>
        <Link href="/opslagruimte-reserveringssysteem" class="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          Ontdek systeem <span>→</span>
        </Link>
      </div>
    `,
    metaDescription: "Waarom online boekingen essentieel zijn voor self-storage operators in Nederland en België. Leer over klantverwachtingen en conversieverhoging.",
    keywords: ["online boekingen self storage", "self storage website", "boekingssysteem", "digitale verkoop"]
  }
};

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = posts[params.slug as keyof typeof posts];
  if (!post) return {};

  return {
    title: `${post.title} | StorageYield Blog`,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: pageUrl(`/blog/${params.slug}`) },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: pageUrl(`/blog/${params.slug}`),
      siteName: "StorageYield",
      locale: "nl_BE",
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image, alt: post.title }]
    }
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = posts[params.slug as keyof typeof posts];
  if (!post) notFound();

  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        <article className="mx-auto max-w-[800px] px-5 py-16">
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 mb-6">
              {post.title}
            </h1>
            <Image src={post.image} alt={post.title} width={800} height={400} className="w-full rounded-lg mb-6" />
          </header>

          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
        </article>
      </main>
      <MarketingFooter />
    </>
  );
}