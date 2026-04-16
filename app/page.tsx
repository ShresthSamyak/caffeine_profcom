import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <CTASection />
      <footer className="bg-coffee-950 text-coffee-400 py-8 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} Caffeine Survey. Built for research
          purposes.
        </p>
      </footer>
    </main>
  );
}
