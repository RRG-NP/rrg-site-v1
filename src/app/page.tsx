'use client';

import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import Navigation from '@/widgets/Navigation';
import Hero from '@/widgets/Hero';
import About from '@/widgets/About';
import Services from '@/widgets/Services';
import Approach from '@/widgets/Approach';
import CallToAction from '@/widgets/CallToAction';
import ShadowCursor from '@/components/ui/ShadowCursor';
import SplashScreen, { STORAGE_KEY } from '@/components/ui/SplashScreen';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile || sessionStorage.getItem(STORAGE_KEY)) {
      setShowSplash(false);
      setHeroReady(true);
    }
  }, []);

  useEffect(() => {
    // Only enable the cursor effect on devices with a fine pointer (mouse/trackpad)
    const query = window.matchMedia('(pointer: fine)');
    setIsPointerDevice(query.matches);
  }, []);

  // Fill reached 100% — reveal the page so it fades in behind the splash.
  const handleReveal = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setHeroReady(true);
  }, []);

  // Splash has fully animated out — remove it from the DOM.
  const handleSplashDone = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <>
      <Navigation logoVisible={heroReady} burgerVisible={heroReady} />
      <Hero ready={heroReady} />
      <About />
      <Services />
      <Approach />
      <CallToAction />
      {isPointerDevice && <ShadowCursor />}
      {showSplash && <SplashScreen onReveal={handleReveal} onDone={handleSplashDone} />}
    </>
  );
}
