import {
  BadgeCheck,
  CalendarCheck,
  ClipboardCheck,
  Compass,
  Gauge,
  LifeBuoy,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { PALETTE } from '../three/palette';

export interface ServiceBullet {
  icon: LucideIcon;
  label: string;
}

export interface Service {
  id: number;
  accent: string; // hex accent used in 3D landing + DOM panel
  title: string;
  kicker: string;
  desc: string;
  bullets: ServiceBullet[];
}

export const SERVICES: Service[] = [
  {
    id: 1,
    accent: PALETTE.accent,
    kicker: "طبقهٔ ۰۱",
    title: "نصب و راه‌اندازی آسانسور",
    desc: "از بررسی چاه تا تحویل نهایی؛ نصب اصولی، رگلاژ دقیق و تست کامل عملکرد، شروعی مطمئن برای چرخهٔ عمر آسانسور شما می‌سازد.",
    bullets: [
      { icon: ClipboardCheck, label: "اجرای استاندارد با نظارت مهندسی" },
      { icon: Gauge, label: "راه‌اندازی و تست عملکرد کامل" },
      { icon: BadgeCheck, label: "تحویل همراه با آموزش بهره‌بردار" },
    ],
  },
  {
    id: 2,
    accent: PALETTE.accent,
    kicker: "طبقهٔ ۰۲",
    title: "فروش تجهیزات و قطعات",
    desc: "تأمین موتور، تابلو فرمان، درب، ریل و متعلقات با اصالت کالا، مشاورهٔ فنی پیش از خرید و پشتیبانی پس از آن.",
    bullets: [
      { icon: PackageCheck, label: "قطعات اصلی و مصرفی با ضمانت اصالت" },
      { icon: Truck, label: "ارسال مطمئن به سراسر کشور" },
      { icon: ShieldCheck, label: "گارانتی و خدمات پس از فروش" },
    ],
  },
  {
    id: 3,
    accent: PALETTE.accent,
    kicker: "طبقهٔ ۰۳",
    title: "طراحی و مشاوره",
    desc: "تحلیل ابعاد چاه، انتخاب ظرفیت و سرعت، و تدوین نقشه‌های اجرایی متناسب با معماری و الگوی بهره‌برداری برج شما.",
    bullets: [
      { icon: Ruler, label: "تحلیل ابعاد چاه و چالهٔ آسانسور" },
      { icon: Compass, label: "تدوین نقشه‌ها و مشخصات فنی اجرایی" },
      { icon: ClipboardCheck, label: "انتخاب سیستم کشش بهینه" },
    ],
  },
  {
    id: 4,
    accent: PALETTE.accent,
    kicker: "طبقهٔ آخر",
    title: "سرویس و نگهداری",
    desc: "بازدیدهای دوره‌ای، سرویس پیشگیرانه و عیب‌یابی تخصصی برای حفظ ایمنی، آرامش حرکت و کاهش توقف‌های ناخواسته.",
    bullets: [
      { icon: CalendarCheck, label: "قراردادهای نگهداری دوره‌ای منعطف" },
      { icon: LifeBuoy, label: "عیب‌یابی و رسیدگی فنی پاسخگو" },
      { icon: ShieldCheck, label: "بازرسی ایمنی و گزارش وضعیت" },
    ],
  },
];

export interface ProjectItem {
  title: string;
  tag: string;
  image?: string;
  soon?: boolean;
}

export const PROJECTS: ProjectItem[] = [
  { title: "کابین لوکس برج مسکونی", tag: "نصب و راه‌اندازی", image: "/images/gallery-cabin.jpg" },
  { title: "موتورخانه و سیستم کشش برج", tag: "تجهیزات", image: "/images/gallery-machine.jpg" },
  { title: "لابی آسانسور هتل پنج‌ستاره", tag: "اجرای کامل", image: "/images/gallery-lobby.jpg" },
  { title: "طراحی چاه و نقشه‌های اجرایی", tag: "طراحی و مشاوره", image: "/images/gallery-design.jpg" },
  { title: "پروژهٔ شما", tag: "به‌زودی", soon: true },
  { title: "نمونه‌کار بعدی", tag: "به‌زودی", soon: true },
];
