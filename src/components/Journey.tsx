import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpLeft } from 'lucide-react';
import { SERVICES, type Service } from '../lib/data';
import { fa } from '../lib/fa';
import { scrollStore } from '../lib/store';
import { runtime } from '../three/runtime';
import { clamp01, DOOR_CENTERS, sstep } from '../three/config';
import type { MotionPhase } from '../three/motion';

gsap.registerPlugin(ScrollTrigger);
const STATIONS = [0, ...DOOR_CENTERS, 0.995];
const LABELS = ['همکف', 'طبقهٔ ۰۱', 'طبقهٔ ۰۲', 'طبقهٔ ۰۳', 'طبقهٔ آخر', 'موتورخانه'];
const PHASES: Record<MotionPhase, string> = {
  open: 'درِ کابین باز است', opening: 'باز شدن در', closing: 'بسته شدن در',
  locked: 'در بسته و قفل است', arriving: 'توقف در ایستگاه', travelling: 'در حال حرکت',
};

function ServiceCopy({ service, refCb }: { service: Service; refCb: (el: HTMLElement | null) => void }) {
  return (
    <article ref={refCb} className="journey-copy" data-service={service.id} aria-hidden="true" inert>
      <div className="journey-kicker">
        <span className="journey-kicker-label">
          <span className="journey-kicker-dot" aria-hidden="true" />
          {service.kicker}
        </span>
        <span dir="ltr">0{service.id} / 04</span>
      </div>
      <div className="journey-body">
        <h3>{service.title}</h3>
        <p>{service.desc}</p>
        <ul className="service-details">
          {service.bullets.map((b) => (
            <li key={b.label}>{b.label}</li>
          ))}
        </ul>
        <a href="#contact" className="service-action">
          گفت‌وگو با کارشناس
          <ArrowUpLeft size={15} strokeWidth={1.5} />
        </a>
      </div>
    </article>
  );
}

function LobbyCopy({ refCb }: { refCb: (el: HTMLElement | null) => void }) {
  return (
    <article ref={refCb} className="journey-copy" data-service="lobby" aria-hidden="true" inert>
      <div className="journey-kicker">
        <span className="journey-kicker-label">
          <span className="journey-kicker-dot" aria-hidden="true" />
          ایستگاه همکف
        </span>
        <span dir="ltr">LOBBY / 00</span>
      </div>
      <div className="journey-body">
        <h3>از لابی تا موتورخانه</h3>
        <p>
          درها باز است. با یک اسکرول کوتاه وارد کابین شوید؛ در هر ایستگاه درها باز
          می‌شوند و خدمات همان طبقه نمایش داده می‌شود.
        </p>
        <a href="#contact" className="service-action">
          گفت‌وگو با کارشناس
          <ArrowUpLeft size={15} strokeWidth={1.5} />
        </a>
      </div>
    </article>
  );
}

function MachineCopy({ refCb }: { refCb: (el: HTMLElement | null) => void }) {
  return (
    <article ref={refCb} className="journey-copy" data-service="machine" aria-hidden="true" inert>
      <div className="journey-kicker">
        <span className="journey-kicker-label">
          <span className="journey-kicker-dot" aria-hidden="true" />
          موتورخانهٔ برج
        </span>
        <span dir="ltr">CROWN / M</span>
      </div>
      <div className="journey-body">
        <h3>قلب مکانیکی برج</h3>
        <p>
          موتور کششی، تابلو فرمان و گاورنر در این طبقه قرار دارند. کابین در طبقهٔ آخر
          متوقف می‌ماند و دوربین به موتورخانه سفر می‌کند.
        </p>
      </div>
    </article>
  );
}

export function Journey({ onActiveChange }: { onActiveChange: (v: boolean) => void }) {
  const section = useRef<HTMLElement>(null!);
  const track = useRef<HTMLDivElement>(null!);
  const copies = useRef<(HTMLElement | null)[]>([]);
  const status = useRef<HTMLDivElement>(null!);
  const connector = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate: (self) => {
          scrollStore.progress = clamp01(self.progress);
        },
        onToggle: (self) => {
          scrollStore.active = self.isActive;
          onActiveChange(self.isActive);
        },
      });

      // Assisted station hops
      let hopping = false;
      const hop = (dir: 1 | -1) => {
        if (hopping) return;
        const p = scrollStore.progress;
        let target = p;
        if (dir > 0) {
          for (const s of STATIONS) if (s > p + 0.02) { target = s; break; }
        } else {
          for (let i = STATIONS.length - 1; i >= 0; i--) if (STATIONS[i] < p - 0.02) { target = STATIONS[i]; break; }
        }
        if (Math.abs(target - p) < 0.01) return;
        hopping = true;
        const start = section.current.offsetTop;
        const range = section.current.offsetHeight - window.innerHeight;
        gsap.to(window, {
          scrollTo: start + target * range,
          duration: 0.9,
          ease: 'power2.inOut',
          onComplete: () => { hopping = false; },
        });
      };

      const onWheel = (e: WheelEvent) => {
        if (!st.isActive || hopping) return;
        if (Math.abs(e.deltaY) < 8) return;
        e.preventDefault();
        hop(e.deltaY > 0 ? 1 : -1);
      };
      section.current.addEventListener('wheel', onWheel, { passive: false });

      return () => {
        st.kill();
        section.current?.removeEventListener('wheel', onWheel);
      };
    }, section);
    return () => ctx.revert();
  }, [onActiveChange]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = runtime.progress;
      // Update copy visibility
      copies.current.forEach((el, i) => {
        if (!el) return;
        const center = STATIONS[i] ?? 0;
        const dist = Math.abs(p - center);
        const visible = dist < 0.08;
        el.setAttribute('aria-hidden', visible ? 'false' : 'true');
        el.style.opacity = visible ? '1' : '0';
        el.style.pointerEvents = visible ? 'auto' : 'none';
      });
      // Status readout
      if (status.current) {
        const floorLabel = LABELS[Math.min(LABELS.length - 1, Math.round(p * 5))] ?? '';
        status.current.innerHTML = `<span>${floorLabel}</span><span>${PHASES[runtime.phase] ?? ''}</span>`;
      }
      // Connector line to doorway
      if (connector.current && runtime.doorway.visible) {
        connector.current.style.display = 'block';
        connector.current.style.left = `${runtime.doorway.x}px`;
        connector.current.style.top = `${runtime.doorway.y}px`;
      } else if (connector.current) {
        connector.current.style.display = 'none';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="journey" className="journey" ref={section}>
      <div className="journey-track" ref={track} style={{ height: '600vh' }}>
        <div className="journey-sticky">
          <div className="journey-stage">
            <LobbyCopy refCb={(el) => { copies.current[0] = el; }} />
            {SERVICES.map((s, i) => (
              <ServiceCopy key={s.id} service={s} refCb={(el) => { copies.current[i + 1] = el; }} />
            ))}
            <MachineCopy refCb={(el) => { copies.current[5] = el; }} />
          </div>
          <div className="journey-status" ref={status} aria-live="polite" />
          <div className="journey-connector" ref={connector} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export function JourneyStatic() {
  return (
    <section id="journey" className="journey-static">
      <div className="site-container">
        <h2 className="section-title">خدمات ما</h2>
        <div className="static-services">
          {SERVICES.map((s) => (
            <article key={s.id} className="static-service">
              <span className="static-kicker">{s.kicker}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>
                {s.bullets.map((b) => (
                  <li key={b.label}>{b.label}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
