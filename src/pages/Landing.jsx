import Header from '../components/Header';
import Hero from '../components/Hero';
import Showcase from '../components/Showcase';
import Features from '../components/Features';
import CurriculumPreview from '../components/CurriculumPreview';
import Voices from '../components/Voices';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Showcase />
        <Features />
        <CurriculumPreview />
        <Voices />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
