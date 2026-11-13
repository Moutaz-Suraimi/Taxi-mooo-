import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Wallet, Clock, Plane, Briefcase, Moon, Star, Phone, ArrowRight, User } from "lucide-react";
import hero from "@/assets/amsterdam-taxi-night.jpg";
import { TripPlanner } from "@/components/trip-planner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AccountModal } from "@/components/AccountModal";
import { ContactModal } from "@/components/ContactModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Taxi Moo — Boek eenvoudig je taxirit in Nederland" },
      { name: "description", content: "Snel, veilig en comfortabel naar je bestemming. Vaste prijzen, 24/7 beschikbaar. Boek je taxi in Amsterdam en heel Nederland." },
      { property: "og:title", content: "Taxi Moo — Boek eenvoudig je taxirit" },
      { property: "og:description", content: "Vaste prijzen, 24/7 beschikbaar, luxe auto's. Boek nu je taxi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = ["Home", "Over ons", "Diensten", "Reviews", "FAQ", "Contact"];

export function Logo() {
  return (
    <a href="#" className="flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-lg font-extrabold text-primary-foreground shadow-glow">M</span>
      <span className="leading-none">
        <span className="block font-display text-xl font-extrabold text-white">Taxi<span className="text-primary">Moo</span></span>
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground">TAXI SERVICE</span>
      </span>
    </a>
  );
}

export function Index() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Apply meta tags from route
  if (Route && typeof (Route as any).useHead === "function") {
    (Route as any).useHead();
  }

  const handleNavClick = (n: string, e: React.MouseEvent) => {
    if (n === "Contact") {
      e.preventDefault();
      setIsContactOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#030914] text-white">
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Zwarte taxi aan een Amsterdamse gracht bij nacht"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-fade" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Logo />
          <nav className="glass hidden gap-1 rounded-full p-1.5 lg:flex">
            {nav.map((n, i) => (
              <a
                key={n}
                href={n === "Home" ? "#" : `#${n.toLowerCase().replace(" ", "-")}`}
                onClick={(e) => handleNavClick(n, e)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  i === 0
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-foreground/80 hover:text-foreground hover:bg-white/10"
                }`}
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="tel:+31641212427"
              className="hidden items-center gap-2 text-sm font-semibold text-white/90 hover:text-white md:flex"
            >
              <Phone className="h-4 w-4 text-primary" />+31 6 41212427
            </a>
            <button
              onClick={() => setIsAccountOpen(true)}
              className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/15 transition cursor-pointer"
            >
              <User className="h-4 w-4" />Mijn account
            </button>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10 lg:pt-14">
          <div className="animate-rise max-w-3xl">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Nu beschikbaar in heel Nederland
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] md:text-7xl tracking-tight text-white">
              Boek eenvoudig<br />je <span className="text-primary">taxirit</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-foreground/80 leading-relaxed">
              Snel, veilig en comfortabel naar je bestemming in Nederland — met vaste prijzen en professionele chauffeurs.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-white/90">
              {[[ShieldCheck, "Betrouwbaar"], [Wallet, "Betaalbaar"], [Clock, "24/7 beschikbaar"]].map(([Icon, l]: any) => (
                <div key={l} className="flex items-center gap-2.5 font-medium">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 border border-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span>{l}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <b className="text-foreground">4.9</b> uit 2.400+ reviews
              </span>
            </div>
            <Button asChild size="lg" className="mt-7">
              <a href="#plan-je-rit">
                Plan je rit <ArrowRight className="h-5 w-5 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <TripPlanner />

      <section id="diensten" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-4xl font-bold text-white">
          Onze <span className="text-primary">diensten</span>
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [Plane, "Schiphol transfer", "Vaste prijs van en naar alle luchthavens, inclusief vluchtbewaking."],
            [Briefcase, "Zakelijk vervoer", "Op rekening rijden met discrete, representatieve chauffeurs."],
            [Moon, "Nachtritten", "Veilig thuis na een avond uit, elke nacht van de week."],
          ].map(([Icon, t, d]: any) => (
            <div
              key={t}
              className="group rounded-2xl border border-white/10 bg-card p-7 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-white">{t}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <Logo />
          <span>© {new Date().getFullYear()} Taxi Moo. Alle rechten voorbehouden.</span>
        </div>
      </footer>

      {/* Account Modal */}
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />

      {/* Contact Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}

export default Index;
