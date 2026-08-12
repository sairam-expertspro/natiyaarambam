"use client";

import { Play } from "lucide-react";
import { Reveal, useSite } from "../components/chrome";
import Image from "next/image";

export default function About() {
  const { goGallery, goHome } = useSite();

  return (
    <div id="about-page">
      <section className="nd-about-banner" aria-labelledby="about-hero-title">
        <img
          className="nd-about-banner-img"
          src="/images/image 7.webp"
          alt="Bharatanatyam dancer in an emerald green and gold sari seated in araimandi before a deep maroon circle"
        />
        <div className="nd-about-banner-scrim" aria-hidden="true" />
        <span className="nd-bell" style={{ left: "7%", top: "26%" }} aria-hidden="true" />
        <span className="nd-bell" style={{ left: "36%", bottom: "22%", animationDelay: "1.6s" }} aria-hidden="true" />
        <span className="nd-bell" style={{ left: "18%", top: "64%", animationDelay: "2.8s" }} aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[540px] max-w-[1180px] flex-col justify-center px-5 py-20 md:min-h-[640px] md:px-8">
          <Reveal>
            <p className="nd-eyebrow nd-eyebrow--light">Natyaarambam Dance Academy</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 id="about-hero-title" className="mt-5 max-w-xl font-display text-[2.6rem] font-bold leading-[1.1] text-cream-50 md:text-[3.4rem]">
              Dance that Speaks the{" "}
              <span className="block text-gold-400">Language of the Soul</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-lg border-l-2 border-gold-500 pl-5 text-[0.97rem] font-light leading-relaxed text-cream-200/85">
              Natyaarambam Dance Academy is more than a dance school; it is a
              sanctuary where the ancient echoes of temple traditions meet
              the precision of modern mastery.
            </p>
          </Reveal>
          <Reveal delay={270}>
            <div className="mt-9 flex flex-wrap gap-4">
              <button type="button" className="nd-btn nd-btn--maroon" onClick={() => goHome("contact")}>Enroll Now</button>
              <button type="button" className="nd-btn nd-btn--gold-outline" onClick={goGallery}>
                <Play size={15} aria-hidden="true" /> Watch Our Gallery
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden bg-cream-100 py-20 md:py-28" aria-labelledby="legacy-title">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          {/* Collage */}
          <Reveal className="relative">
            <div className="relative mx-auto h-[480px] max-w-[460px] sm:h-[560px]">
              <span className="nd-petal" style={{ left: "-40px", top: "30px", width: 190, height: 190 }} aria-hidden="true" />
              <span className="nd-petal nd-petal--flip" style={{ left: "-70px", top: "170px", width: 150, height: 150 }} aria-hidden="true" />
              <div className="nd-img-zoom absolute right-0 top-0 w-[64%] shadow-xl">
                <img
                  src="/images/Images/57.webp"
                  alt="Dancer in a red costume performing under warm stage light"
                  className="h-[300px] w-full object-cover sm:h-[360px]"
                  loading="lazy"
                />
              </div>
              <div className="nd-img-zoom absolute bottom-0 left-0 w-[58%] border-[6px] border-cream-50 shadow-xl">
                <img
                  src="/images/salangai.webp"
                  alt="A guru seated outdoors teaching a circle of young students"
                  className="nd-grayscale h-60 w-full object-cover sm:h-[280px]"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          {/* Story */}
          <div>
            <Reveal>
              <h2 id="legacy-title" className="font-display text-[2rem] font-bold text-maroon-800 md:text-[2.5rem]">
                The Legacy of Natyaarambam
              </h2>
            </Reveal>
            <div className="mt-6 space-y-4 text-[0.92rem] font-light leading-relaxed text-ink-500">
              <Reveal delay={80}>
                <p>
                  Natyaarambam Dance Academy (NDA) was founded in 2018 by Guru
                  Smt. Hema Chandrasekaran in Bentonville, Arkansas, USA, with
                  a vision to nurture young dancers and promote the rich
                  heritage of Indian classical arts.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p>
                  What started as a humble initiative with just three students
                  soon blossomed into a vibrant dance community. Through her
                  dedication, passion for teaching, and warm, student-centered
                  approach, Guru Hema inspired students to develop not only
                  technical excellence but also a deep appreciation for Indian
                  culture and tradition.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p>
                  Over the years, Natyaarambam students have become active
                  participants in the cultural fabric of the community,
                  performing regularly at temple and cultural events, including
                  Sankirtana and Navarathiri celebrations. Their performances
                  have been widely appreciated for their discipline, artistry,
                  and stage presence.
                </p>
              </Reveal>
              <Reveal delay={260}>
                <p>
                  At Natyaarambam, we believe that dance is more than an art
                  form—it is a journey of discipline, self-expression,
                  confidence, and cultural connection. As we continue to grow,
                  we remain committed to nurturing the next generation of
                  dancers and preserving the timeless beauty of Indian
                  classical arts.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== GURU HEMA ====================== */}
      <section className="nd-guru-band py-20 md:py-28" aria-labelledby="guru-title">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="text-center">
            <Reveal>
              <h2 id="guru-title" className="font-display text-[2.2rem] font-bold text-gold-400 md:text-[3rem]">
                Guru Hema Chandrasekaran
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mx-auto mt-5 max-w-2xl font-display text-[1.02rem] italic leading-relaxed text-cream-200/80">
                A passionate Bharatanatyam exponent dedicated to preserving the
                timeless traditions of Indian classical dance while inspiring
                the next generation through excellence, discipline, and
                artistic expression.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
            {/* Founder portrait */}
            <Reveal>
              <figure className="nd-founder-card relative overflow-hidden rounded-md">
                <img
                  src="/images/2.webp"
                  alt="Guru Hema Chandrasekaran in a yellow sari with temple jewelry"
                  className="h-[520px] w-full object-cover object-top md:h-[600px]"
                  loading="lazy"
                />
                <figcaption className="nd-founder-overlay absolute inset-x-0 bottom-0 p-7">
                  <p className="nd-eyebrow nd-eyebrow--light">Founder & Artistic Director</p>
                  <p className="mt-2 font-display text-[1.7rem] font-bold leading-tight text-cream-50">
                    Hema Chandrasekaran
                  </p>
                </figcaption>
              </figure>
            </Reveal>

            {/* Journey card */}
            <Reveal delay={140}>
              <article className="nd-journey-card relative h-full rounded-md p-8 md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="font-display text-[1.6rem] font-semibold text-cream-50 md:text-[1.9rem]">
                    The Journey of Natyaarambam
                  </h3>
                  <img
                    src="/images/Portfolio.webp"
                    alt="Hands held in a dance mudra"
                    className="h-18 w-18 fixed flex-none rounded-full z-20 border-2 border-gold-500/70 object-cover left-10% right-10 top-[2%] md:h-22 md:w-22"
                    loading="lazy"
                  />
                </div>
                <div className="mt-6 space-y-5 text-[0.9rem] font-light leading-relaxed text-cream-200/85">
                  <p>
                    Smt. Hema Chandrasekaran is a renowned Bharatanatyam
                    dancer, choreographer, and the Founder of{" "}
                    <strong className="font-medium text-cream-50">Natyaarambam Dance Academy</strong>.
                    She began her Bharatanatyam journey at the age of five in
                    the Nilgiris, Tamil Nadu, where her passion for Indian
                    classical dance was nurtured under the guidance of her
                    first guru, Smt. Sarojini. Trained under the esteemed
                    guidance of Guru Smt. Sarojini (Trichy Kalai Kaveri College
                    of Arts) in Thanjavur Bani and Kerala Kalamandalam Muthu
                    Mani Iyer, trained in the traditional Thanjavur Bani, she
                    developed a strong foundation in technique, discipline, and
                    artistic expression. As a young performer, she represented
                    Tamil Nadu at prestigious cultural events, including an
                    Indian Red Cross heritage festival in Delhi, earning
                    recognition for her expressive performances and dedication
                    to the art.
                  </p>
                  <p>
                    While pursuing her Bachelor of Technology in Information
                    Technology, Hema successfully balanced academics with her
                    commitment to Bharatanatyam, receiving several awards and
                    exploring choreography through various cultural
                    productions. Although family responsibilities led to a
                    brief pause in her performing career, her passion for dance
                    remained unwavering. In 2018, she founded Natyaarambam
                    Dance Academy with a vision to preserve the rich traditions
                    of Bharatanatyam while inspiring students through
                    disciplined training, artistic excellence, and cultural
                    values. Today, she continues to mentor aspiring dancers,
                    nurturing confidence, creativity, and a deep respect for
                    India's classical heritage, ensuring that the timeless
                    legacy of Bharatanatyam flourishes for generations to come.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================== CTA BAND ====================== */}
      <section className="nd-cta" aria-labelledby="about-cta-title">
        {/* <span className="nd-cta-shape nd-cta-shape--diamond" style={{ left: "6%", top: "18%" }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--diamond" style={{ right: "10%", bottom: "14%", width: 90, height: 90 }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--circle" style={{ right: "-70px", top: "-70px", width: 240, height: 240 }} aria-hidden="true" />
        <span className="nd-cta-shape nd-cta-shape--circle" style={{ left: "14%", bottom: "-110px", width: 200, height: 200 }} aria-hidden="true" /> */}
        <span className="nd-cta-watermark" style={{ right: "4%", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true">
          <Image src="/images/Decorative Lotus watermark.svg" alt="" width={500} height={500} className="opacity-5 relative top-20 left-50" />
        </span>

        <div className="relative mx-auto max-w-[760px] px-5 py-20 text-center md:py-24">
          <Reveal>
            <h2 id="about-cta-title" className="font-display text-[2rem] font-bold text-cream-50 md:text-[2.6rem]">
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
              <button type="button" className="nd-btn nd-btn--gold-solid" onClick={() => goHome("contact")}>Enroll Now</button>
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
