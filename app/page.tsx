import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { UberVisaCard } from "@/components/sections/UberVisaCard";
import { UberVisaLocalOffers } from "@/components/sections/UberVisaLocalOffers";
import { UberGiftCards } from "@/components/sections/UberGiftCards";
import { UberCash } from "@/components/sections/UberCash";
import { UberSpotify } from "@/components/sections/UberSpotify";
import { UberPartnerships } from "@/components/sections/UberPartnerships";
import { LeafLinkFinancial } from "@/components/sections/LeafLinkFinancial";
import { LeafLinkApiIntegrations } from "@/components/sections/LeafLinkApiIntegrations";
import { Zinio } from "@/components/sections/Zinio";
import { MutatingMonsters } from "@/components/sections/MutatingMonsters";
import { Byeeee } from "@/components/sections/Byeeee";

export default function Home() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <UberVisaCard />
        <UberVisaLocalOffers />
        <UberGiftCards />
        <UberCash />
        <UberSpotify />
        <UberPartnerships />
        <LeafLinkFinancial />
        <LeafLinkApiIntegrations />
        <Zinio />
        <MutatingMonsters />
        <Byeeee />
      </main>
      <Footer />
    </div>
  );
}
