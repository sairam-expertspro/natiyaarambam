"use client";

import { useState, type FormEvent } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Play,
  Send,
} from "lucide-react";
import { Reveal, scrollToId, useSite } from "../components/chrome";
import Image from "next/image";

const JOURNEY = [
  {
    icon: CalendarDays,
    title: "Free Trial Class",
    text: "Experience our teaching methodology firsthand before formal enrollment.",
  },
  {
    icon: GraduationCap,
    title: "Assessment Sessions",
    text: "For students with prior experience, we offer assessment to place you in the correct level.",
  },
  {
    icon: BadgeCheck,
    title: "Certified Curriculum",
    text: "Graduate with a globally recognized certification from Natyaarambam Dance Academy.",
  },
];

const HOURS = [
  { day: "Monday — Friday", time: "06:00 AM – 08:30 PM" },
  { day: "Saturday", time: "08:00 AM – 04:00 PM" },
  { day: "Sunday", time: "By Appointment Only" },
];

const INFO_CARDS = [
  { icon: Mail, label: "Email", value: "natyaarambham@gmail.com", href: "mailto:natyaarambham@gmail.com" },
  { icon: MapPin, label: "Location", value: "Collinsbrook farm Community,Frisco 14901, Thunder Rd, Frisco, 75035" },
  { icon: Phone, label: "Contact", value: "+1 (945) 699-0311", href: "tel:+19456990311" },
  { icon: Globe, label: "Website", value: "www.natyaarambam.com", href: "https://www.natyaarambam.com" },
];

export default function Contact() {
  const { showToast, goGallery } = useSite();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    level: "Beginner (Prarambhika)",
    guardian: "",
    aspirations: "",
  });

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      showToast("Please add the student's name and a phone or email so we can reply");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div id="contact-page">
      {/* ====================== CONTACT HERO ====================== */}
      <section className="nd-contact-hero" aria-labelledby="contact-title">
        <img className="nd-contact-media" src="/images/Contact.webp" alt="A devotee seated in prayer before a lamp-lit shrine inside a carved stone temple" />
        <div className="nd-contact-overlay" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[540px] max-w-[1180px] flex-col justify-center px-5 py-20 md:min-h-[640px] md:px-8">
          <Reveal>
            <p className="nd-eyebrow nd-eyebrow--light">Contact Us</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 id="contact-title" className="mt-5 max-w-2xl font-display text-[2.5rem] font-bold leading-[1.1] text-cream-50 md:text-[3.4rem]">
              Begin Your <span className="text-gold-400">Journey of Mastery</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-lg border-l-2 border-gold-500 pl-5 text-[0.97rem] font-light leading-relaxed text-cream-200/85">
              Whether you are a novice seeker or a seasoned practitioner, our
              doors are open to those who respect the geometry of tradition.
              Reach out to schedule a visit or inquire about our specialized
              curriculum.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== JOINING + ENROLL FORM ====================== */}
      <section id="enroll" className="scroll-mt-24 bg-cream-100 py-20 md:py-28" aria-labelledby="joining-title">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left — journey + hours */}
          <div>
            <Reveal>
              <p className="nd-eyebrow">Joining Natyaarambam</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="joining-title" className="mt-3 font-display text-[2rem] font-bold leading-tight text-maroon-800 md:text-[2.4rem]">
                Begin Your Dance Journey With Us
              </h2>
            </Reveal>

            <div className="mt-9 space-y-7">
              {JOURNEY.map((j, i) => (
                <Reveal key={j.title} delay={140 + i * 90}>
                  <div className="flex gap-4">
                    <span className="nd-journey-icon" aria-hidden="true">
                      <j.icon size={18} strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="font-display text-[1.12rem] font-semibold text-ink-900">{j.title}</h3>
                      <p className="mt-1.5 max-w-sm text-sm font-light leading-relaxed text-ink-500">{j.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={380}>
              <div className="nd-hours-card mt-10 max-w-md p-7">
                <h3 className="font-display text-[1.5rem] font-bold text-ink-900">Visiting Hours</h3>
                <dl className="mt-5">
                  {HOURS.map((h) => (
                    <div key={h.day} className="flex items-baseline justify-between gap-4 border-b border-maroon-800/10 py-3 last:border-b-0">
                      <dt className="font-display text-[0.95rem] italic text-ink-700">{h.day}</dt>
                      <dd className="text-sm font-light text-ink-700">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-ink-400">
                  Please call ahead for studio tours to ensure classes are not in session.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right — Enroll form */}
          <Reveal delay={160}>
            <div className="nd-enroll-card p-8 md:p-10" id="enroll-form">
              {submitted ? (
                <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                  <span className="nd-success-mark" aria-hidden="true">
                    <CheckCircle2 size={30} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-6 font-display text-[1.8rem] font-bold text-maroon-800">
                    Welcome to the Family{form.name ? `, ${form.name.split(" ")[0]}` : ""}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-ink-500">
                    Your enrollment request for the{" "}
                    <strong className="font-medium text-ink-700">{form.level}</strong> track has
                    been received. Guru Hema's office will reach out within one
                    business day to schedule your trial class.
                  </p>
                  <button
                    type="button"
                    className="nd-btn nd-btn--ghost-maroon mt-8"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", age: "", phone: "", email: "", level: "Beginner (Prarambhika)", guardian: "", aspirations: "" });
                    }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <h3 className="font-display text-[2rem] font-bold text-maroon-800">Enroll</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-ink-500">
                    Tell us about your background and what you seek to achieve
                    through Bharatanatyam.
                  </p>

                  <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="nd-field">
                      <label htmlFor="f-name">Student Name</label>
                      <input id="f-name" type="text" placeholder="e.g. Anjali Rao" value={form.name} onChange={set("name")} required />
                    </div>
                    <div className="nd-field">
                      <label htmlFor="f-age">Student Age</label>
                      <input id="f-age" type="number" min="3" max="99" placeholder="Years" value={form.age} onChange={set("age")} />
                    </div>
                    <div className="nd-field">
                      <label htmlFor="f-phone">Mobile Number</label>
                      <input id="f-phone" type="tel" placeholder="1234567890" value={form.phone} onChange={set("phone")} />
                    </div>
                    <div className="nd-field">
                      <label htmlFor="f-email">Email</label>
                      <input id="f-email" type="email" placeholder="Dance@gmail.com" value={form.email} onChange={set("email")} />
                    </div>
                    <div className="nd-field">
                      <label htmlFor="f-level">Experience Level</label>
                      <select id="f-level" value={form.level} onChange={set("level")}>
                        <option>Beginner (Prarambhika)</option>
                        <option>Intermediate (Madhyama)</option>
                        <option>Advanced (Praveena)</option>
                        <option>Semi-Classical</option>
                        <option>Not sure yet</option>
                      </select>
                    </div>
                    <div className="nd-field">
                      <label htmlFor="f-guardian">Parent/Guardian Name</label>
                      <input id="f-guardian" type="text" placeholder="If applicable" value={form.guardian} onChange={set("guardian")} />
                    </div>
                  </div>

                  <div className="nd-field mt-6">
                    <label htmlFor="f-asp">Personal Aspirations</label>
                    <textarea
                      id="f-asp"
                      rows={3}
                      placeholder="Share your previous training history or your goals for joining the academy…"
                      value={form.aspirations}
                      onChange={set("aspirations")}
                    />
                  </div>

                  <button type="submit" className="nd-btn nd-btn--maroon mt-9 uppercase tracking-[0.18em]" style={{ fontSize: "0.78rem" }}>
                    Submit <Send size={14} aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== FIND US ====================== */}
      <section className="bg-cream-100 pb-20 md:pb-28" aria-labelledby="findus-title">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <Reveal>
            <div className="nd-find-card">
              <h2 id="findus-title" className="font-display text-[1.6rem] font-bold text-ink-900">Find Us</h2>
              <div className="nd-find-grid">
                {/* Map */}
                <div className="nd-map-frame">
                  <iframe
                    title="Natyaarambam Dance Academy"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3338.522839968172!2d-96.77220917452146!3d33.200386773489676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c3d003c8c6ff1%3A0x81fdb5e6c0efce1!2sCollinsbrook%20farms!5e0!3m2!1sen!2sin!4v1786451879477!5m2!1sen!2sin"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {/* <p className="mt-4 text-sm font-light text-ink-500">
                    585, 2nd Main, RHCS Layout, Annapoorneshwari Nagar, Bangalore 560091
                  </p> */}
                </div>

                {/* Contact info mini cards */}
                <div className="nd-contact-info-panel">
                  <p className="nd-eyebrow">Get in Touch</p>
                  <h3 className="mt-2 font-display text-[1.6rem] font-bold text-ink-900">Contact Information</h3>
                  <div className="nd-contact-info-grid">
                    {INFO_CARDS.map((c, i) => (
                      <Reveal key={c.label} delay={i * 80}>
                        <div className="nd-info-mini">
                          <span className="nd-icon-square" aria-hidden="true">
                            <c.icon size={16} strokeWidth={1.7} />
                          </span>
                          <p className="mt-3 text-[0.8rem] font-semibold text-ink-900">{c.label}</p>
                          {c.href ? (
                            <a href={c.href} className="mt-0.5 block text-[0.8rem] font-light text-ink-500 transition-colors hover:text-maroon-700">
                              {c.value}
                            </a>
                          ) : (
                            <p className="mt-0.5 text-[0.8rem] font-light text-ink-500">{c.value}</p>
                          )}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== CTA BAND ====================== */}
      <section className="nd-cta" aria-labelledby="contact-cta-title">
        {/* <span className="nd-cta-shape nd-cta-shape--diamond" style={{ left: "6%", top: "18%" }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--diamond" style={{ right: "10%", bottom: "14%", width: 90, height: 90 }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--circle" style={{ right: "-70px", top: "-70px", width: 240, height: 240 }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--circle" style={{ left: "14%", bottom: "-110px", width: 200, height: 200 }} aria-hidden="true" /> */}
        <span className="nd-cta-watermark" style={{ right: "4%", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true">
                    <Image src="/images/Decorative Lotus watermark.svg" alt="" width={500} height={500} className="opacity-5 relative top-20 left-50" />
        </span>

        <div className="relative mx-auto max-w-[760px] px-5 py-20 text-center md:py-24">
          <Reveal>
            <h2 id="contact-cta-title" className="font-display text-[2rem] font-bold text-cream-50 md:text-[2.6rem]">
              Begin Your Journey Within
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-cream-200/85">
              Whether you are a seasoned practitioner or a curious beginner,
              our space is designed to support your evolution.
            </p>
          </Reveal>
          <Reveal delay={190}>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <button type="button" className="nd-btn nd-btn--gold-solid" onClick={() => scrollToId("enroll")}>Enroll Now</button>
              <button type="button" className="nd-btn nd-btn--outline-cream" onClick={goGallery}>
                <Play size={15} aria-hidden="true" /> Watch Our Gallery
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
