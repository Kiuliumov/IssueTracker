import FeatureSection from "./components/home/FeatureSection";
import Hero from "./components/home/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Hero />
      <FeatureSection />
    </main>
  );
}
