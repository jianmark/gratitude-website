import { useState, useEffect, useCallback } from 'react';

interface Slide {
  src: string;
  alt: string;
}

const slides: Slide[] = [
  { src: '/screenshots/welcome-screen.svg', alt: 'Gratitude Hotel — Schermata di benvenuto tablet' },
  { src: '/screenshots/tablet-checkout.svg', alt: 'Gratitude — Selezione mancia su tablet' },
  { src: '/screenshots/dashboard-overview.svg', alt: 'Gratitude — Dashboard panoramica' },
  { src: '/screenshots/qr-landing-mobile.svg', alt: 'Gratitude — QR Code landing page mobile' },
  { src: '/screenshots/guest-feedback.svg', alt: 'Gratitude — Feedback ospiti' },
  { src: '/screenshots/distribution-page.svg', alt: 'Gratitude — Distribuzione mance per settore' },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides container */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={800}
            height={600}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 700ms ease-in-out',
              opacity: i === current ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-teal-600 dark:bg-teal-400 w-6'
                : 'bg-stone-300 dark:bg-navy-600 hover:bg-stone-400 dark:hover:bg-navy-500 w-2.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
