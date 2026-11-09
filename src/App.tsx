import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { Header } from "./components/Header";
import { Hero, HeroStatic } from "./components/Hero";
import { Journey, JourneyStatic } from "./components/Journey";
import { About, Contact, Footer, Projects } from "./components/Sections";
import { ExperienceCanvas } from "./three/Scene";
import { detectEnvironment } from "./lib/store";

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function App() {
  const [env, setEnv] = useState<{ ready: boolean; interactive: boolean }>({
    ready: false,
    interactive: false,
  });
  const [active, setActive] = useState(true);

  useEffect(() => {
    const check = () => {
      const { webgl, reduced } = detectEnvironment();
      setEnv({ ready: true, interactive: webgl && !reduced });
    };
    check();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    motion.addEventListener('change', check);
    return () => motion.removeEventListener('change', check);
  }, []);

  const handleActive = useCallback((v: boolean) => setActive(v), []);
  const handleUnavailable = useCallback(() => setEnv({ ready: true, interactive: false }), []);

  return (
    <div className="site-shell relative min-h-screen bg-night-900" dir="rtl">
      {env.interactive && (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <SceneBoundary onUnavailable={handleUnavailable}>
            <ExperienceCanvas active={active} />
          </SceneBoundary>
        </div>
      )}

      <Header />

      <main>
        {env.ready &&
          (env.interactive ? (
            <>
              <Hero />
              <Journey onActiveChange={handleActive} />
            </>
          ) : (
            <>
              <HeroStatic />
              <JourneyStatic />
            </>
          ))}
        <About />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
