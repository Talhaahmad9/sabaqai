"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function LandingPageShell() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
    >
      {/* Background gradients only */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/2 w-full h-full bg-gradient-radial from-purple-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-1/2 w-full h-full bg-gradient-radial from-blue-900/20 to-transparent rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 40, 255, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(0, 120, 255, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
      </div>

      {/* Main content */}
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </motion.div>
  );
}
