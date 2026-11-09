import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function Copy({ interactive }: { interactive: boolean }) {
  return (
    <>
      <p className="hero-eyebrow" data-hero>
        <b dir="ltr">ARSH PEYMA</b>
        <span dir="ltr">/ Tower Systems</span>
        <span className="brass" dir="ltr">EST. SPADANA</span>
      </p>

      <p className="hero-brand" data-hero>عرش پیمای اسپادانا</p>

      <h1 className="hero-tagline" data-hero>
        تجربه‌ای
        <em>
          فراتر از یک <span className="mark">جابه‌جایی</span>
        </em>
      </h1>

      <p className="hero-description" data-hero>
        راهکارهای آسانسور، از طراحی و نصب تا سرویس و نگهداری؛ با دقت معماری و
        اصالت مهندسی در هر جزئیات.
      </p>

      <div className="hero-actions" data-hero>
        <a href="#journey" className="primary-action">
          {interactive ? 'آغاز صعود' : 'شناخت خدمات'}
          <ArrowDownRight size={15} strokeWidth={1.4} />
        </a>
        <a href="#contact" className="text-action">
          گفت‌وگو دربارهٔ پروژه
          <ArrowUpRight size={13} strokeWidth={1.4} />
        </a>
      </div>
    </>
  );
}

export function Hero() {
  const section = useRef<HTMLElement>(null!);
  const content = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(content.current.querySelectorAll('[data-hero]'), {
        y: 18,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
      });
      gsap.to(content.current, {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '75% top',
          scrub: true,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);
  return (
    <section id="top" className="hero" ref={section}>
      <div className="hero-shade" />
      <div className="site-container">
        <div className="hero-copy" ref={content}>
          <Copy interactive />
        </div>
      </div>
      <div className="hero-scroll">
        <span />
        Scroll to ascend
      </div>
    </section>
  );
}

export function HeroStatic() {
  return (
    <section id="top" className="hero overflow-hidden bg-[#D8CFBC]">
      <img
        src="/images/gallery-cabin.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="hero-shade" />
      <div className="site-container">
        <div className="hero-copy">
          <Copy interactive={false} />
        </div>
      </div>
    </section>
  );
}
