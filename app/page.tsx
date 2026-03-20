import Header from '@/component/landing/Header';
import HeroSection from '@/component/landing/HeroSection';
import FeaturesSection from '@/component/landing/FeaturesSection';
import ReviewsSection from '@/component/landing/ReviewsSection';
import FAQSection from '@/component/landing/FAQSection';
import Footer from '@/component/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ReviewsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
