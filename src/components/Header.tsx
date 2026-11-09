import { useEffect, useState } from 'react';
import { ArrowUpLeft, Menu, X } from 'lucide-react';

const LINKS = [
  { href: '#journey', label: 'خدمات' },
  { href: '#about', label: 'دربارهٔ ما' },
  { href: '#projects', label: 'پروژه‌ها' },
  { href: '#contact', label: 'تماس' },
];

/** Full identity lockup — used in the footer. */
export function Logo() {
  return (
    <a href="#top" className="brand-mark" aria-label="عرش پیمای اسپادانا، صفحهٔ نخست">
      <span className="brand-badge" aria-hidden="true">
        <svg viewBox="0 0 34 42" className="brand-symbol">
          <path
            d="M6 36V12L17 5l11 7v24M12 36V17l5-3 5 3v19M17 14v22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          />
        </svg>
      </span>
      <span>
        <span className="brand-name">عرش پیمای اسپادانا</span>
        <span className="brand-latin" dir="ltr">ARSH PEYMA ESPADANA</span>
      </span>
    </a>
  );
}

/**
 * The header bar carries no surface at all: one white wordmark, four links and
 * one text action, blended against whatever is beneath them — the shaft, an ink
 * band, or paper. It never switches colour with scroll or scene, yet it can
 * never be lost against the model.
 *
 * The mobile sheet is rendered as a sibling so it stays outside that blend.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="site-container header-inner">
          <a href="#top" className="brand-wordmark" aria-label="عرش پیمای اسپادانا، صفحهٔ نخست">
            عرش پیمای اسپادانا
          </a>

          <nav className="header-links" aria-label="ناوبری اصلی">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-right">
            <a href="#contact" className="header-action" onClick={() => setOpen(false)}>
              درخواست مشاوره
              <ArrowUpLeft size={13} strokeWidth={1.5} />
            </a>
            <button
              className="mobile-menu"
              aria-label={open ? 'بستن فهرست' : 'باز کردن فهرست'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="ناوبری موبایل">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
