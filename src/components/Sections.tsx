import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Logo } from "./Header";
import { PROJECTS } from "../lib/data";

function SectionHead({
  index,
  label,
  title,
  desc,
  tone = "dark",
}: {
  index: string;
  label: string;
  title: string;
  desc?: string;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <div className="grid gap-8 md:grid-cols-12 md:items-start md:gap-8">
      <div className="flex items-center gap-4 md:col-span-2 md:block">
        <span
          className={`section-index ${dark ? "text-[#D8CFBC]" : "text-[#565449]"}`}
          dir="ltr"
        >
          {index}
        </span>
        <span
          className={`mt-0 block h-px w-10 md:mt-4 ${dark ? "bg-white/25" : "bg-[#11120D]/25"}`}
          aria-hidden="true"
        />
      </div>
      <div className="md:col-span-10">
        <p className={`section-kicker ${dark ? "text-[#D8CFBC]" : "text-[#565449]"}`}>
          {label}
        </p>
        <h2
          className={`section-title mt-5 max-w-[16ch] text-[36px] leading-[1.18] md:text-[52px] ${
            dark ? "text-[#FFFBF4]" : "text-[#11120D]"
          }`}
        >
          {title}
        </h2>
        {desc && (
          <p
            className={`mt-4 max-w-[46ch] text-[13px] leading-8 ${
              dark ? "text-[#D8CFBC]" : "text-[#565449]"
            }`}
          >
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="about-section">
      <div className="site-container py-24 md:py-32">
        <SectionHead
          index="01"
          label="دربارهٔ ما"
          title="مهندسی دقیق، اجرای مطمئن"
          desc="عرش پیمای اسپادانا با تمرکز بر کیفیت ساخت، ایمنی و دوام، راهکارهای آسانسور را از مرحلهٔ طراحی تا بهره‌برداری همراهی می‌کند."
          tone="dark"
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            { t: "استاندارد ملی و بین‌المللی", d: "اجرای پروژه‌ها مطابق مقررات ملی ساختمان و استانداردهای ایمنی آسانسور." },
            { t: "تیم مهندسی مجرب", d: "طراحی، نصب و سرویس توسط کارشناسان با سابقه در پروژه‌های بلندمرتبه." },
            { t: "پشتیبانی پاسخگو", d: "قراردادهای نگهداری منعطف و دسترسی سریع به قطعات و خدمات." },
          ].map((item) => (
            <div key={item.t} className="about-card">
              <h3 className="text-[#FFFBF4] text-lg mb-3">{item.t}</h3>
              <p className="text-[#D8CFBC] text-[13px] leading-7">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="site-container py-24 md:py-32">
        <SectionHead
          index="02"
          label="نمونه کارها"
          title="پروژه‌های منتخب"
          desc="تصاویر و عناوین زیر جنبهٔ نمایشی دارند و جایگزین نمونه‌کار واقعی شرکت خواهند شد."
          tone="light"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <article key={p.title} className={`project-card ${p.soon ? "is-soon" : ""}`}>
              {p.image && (
                <div className="project-image">
                  <img src={p.image} alt={p.title} loading="lazy" />
                </div>
              )}
              <div className="project-meta">
                <span className="project-tag">{p.tag}</span>
                <h3>{p.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1200);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="site-container py-24 md:py-32">
        <SectionHead
          index="03"
          label="تماس"
          title="درخواست مشاوره"
          desc="فرم زیر یک نمونهٔ رابط کاربری است. قبل از انتشار عمومی باید به یک endpoint واقعی متصل شود."
          tone="light"
        />
        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="contact-item">
              <Phone size={16} />
              <span dir="ltr">+98 31 0000 0000</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span dir="ltr">info@arshpeyma.example</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>اصفهان، ایران</span>
            </div>
            <div className="contact-item">
              <Clock size={16} />
              <span>شنبه تا چهارشنبه، ۹ تا ۱۷</span>
            </div>
          </div>
          <form className="lg:col-span-7 contact-form" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span>نام و نام خانوادگی</span>
                <input required name="name" autoComplete="name" />
              </label>
              <label>
                <span>شماره تماس</span>
                <input required name="phone" type="tel" autoComplete="tel" dir="ltr" />
              </label>
            </div>
            <label>
              <span>موضوع یا نوع پروژه</span>
              <input name="subject" />
            </label>
            <label>
              <span>توضیحات</span>
              <textarea name="message" rows={4} />
            </label>
            <button type="submit" className="primary-action" disabled={status !== "idle"}>
              {status === "loading" && <Loader2 className="animate-spin" size={16} />}
              {status === "done" && <Check size={16} />}
              {status === "idle" && "ارسال درخواست"}
              {status === "loading" && "در حال ارسال…"}
              {status === "done" && "ارسال شد"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Logo />
          <nav className="footer-links" aria-label="پاورقی">
            <a href="#journey">خدمات</a>
            <a href="#about">دربارهٔ ما</a>
            <a href="#projects">پروژه‌ها</a>
            <a href="#contact">تماس</a>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-[12px] text-[#D8CFBC] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} عرش پیمای اسپادانا. همهٔ حقوق محفوظ است.</p>
          <p dir="ltr" className="opacity-70">ARSH PEYMA ESPADANA · Tower Systems</p>
        </div>
      </div>
    </footer>
  );
}
