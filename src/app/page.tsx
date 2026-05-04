'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/widgets/Navigation';
import Hero from '@/widgets/Hero';
import About from '@/widgets/About';
import Services from '@/widgets/Services';
import Approach from '@/widgets/Approach';
import CallToAction from '@/widgets/CallToAction';
import ShadowCursor from '@/components/ui/ShadowCursor';
import { STORAGE_KEY } from '@/components/ui/LogoLoader';

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setHeroReady(true);
    } else {
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    // Only enable the cursor effect on devices with a fine pointer (mouse/trackpad)
    const query = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(query.matches);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setShowIntro(false);
    setHeroReady(true);
  };

  return (
    <>
      <Navigation logoVisible={heroReady} burgerVisible={heroReady} />
      <Hero ready={heroReady} showIntro={showIntro} onIntroComplete={handleIntroComplete} />
      <About />
      <Services />
      <Approach />
      <CallToAction />
      {isPointerDevice && <ShadowCursor />}
    </>
  );
}
