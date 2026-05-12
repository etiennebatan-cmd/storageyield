import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Blog | StorageYield - Self-storage inzichten en tips",
  description: "Praktische gidsen, inzichten en tips voor self-storage operators in Nederland en België. Leer over revenue optimalisatie, prijzen en online boekingen.",
  alternates: { canonical: pageUrl("/blog") },
  openGraph: {
    title: "Blog | StorageYield - Self-storage inzichten en tips",
    description: "Praktische gidsen, inzichten en tips voor self-storage operators in Nederland en België.",
    url: pageUrl("/blog"),
    siteName: "StorageYield",
    locale: "nl_BE",
    type: "website"
  }
};

const posts = [
  {
    slug: "hoe-verhoog-je-self-storage-omzet-met-concurrent-analyse",
    title: "Hoe verhoog je self-storage omzet met concurrent analyse",
    excerpt: "Leer hoe je met systematische concurrent analyse je prijzen optimaliseert en meer boekingen binnenhaalt. Praktische stappen voor Nederlandse en Belgische operators.",
    date: "2026-05-10",
    readTime: "8 min lezen",
    image: "/blog-images/competitor-analysis.jpg"
  },
  {
    slug: "ultieme-gids-self-storage-prijzen-nederland",
    title: "De ultieme gids voor self-storage prijzen in Nederland",
    excerpt: "Alles wat je moet weten over prijzen per vierkante meter, seizoensinvloeden en hoe je concurrenten slaat zonder je winst te verliezen.",
    date: "2026-05-08",
    readTime: "12 min lezen",
    image: "/blog-images/pricing-guide.jpg"
  },
  {
    slug: "waarom-benelux-self-storage-online-boekingen-nodig-heeft",
    title: "Waarom Benelux self-storage operators online boekingen nodig hebben",
    excerpt: "Waarom traditionele telefoonboekingen niet meer werken en hoe online systemen je bezettingsgraad met 25% verhogen.",
    date: "2026-05-05",
    readTime: "6 min lezen",
    image: "/blog-images/online-booking.jpg"
  }
];

export default function BlogPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        <section className="mx-auto max-w-[1240px] px-5 py-16">
          <div className="mb-12 text-center">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Blog</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950">
              Self-storage inzichten en tips
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl leading-8 text-slate-600">
              Praktische gidsen voor operators die hun opslaglocatie willen optimaliseren. Van prijzen tot technologie.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="aspect-video bg-slate-100 flex items-center justify-center">
                  <Image src={post.image} alt={post.title} width={400} height={250} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-950 mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-emerald-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700">
                    Lees verder <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}