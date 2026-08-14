"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { useSite } from "@/lib/site-context";

export default function About() {
  const { goGallery, goHome } = useSite();

  return (
    <div id="about-page">
      <PageHero
        id="about-hero-title"
        variant="banner"
        bells
        image={{
          src: "/images/image 7.webp",
          alt: "Bharatanatyam dancer in an emerald green and gold sari seated in araimandi before a deep maroon circle",
        }}
        eyebrow="Natyaarambam Dance Academy"
        titleClassName="mt-5 max-w-xl font-display text-[2.6rem] font-bold leading-[1.1] text-cream-50 md:text-[3.4rem]"
        title={
          <>
            Dance that Speaks the{" "}
            <span className="block text-gold-400">Language of the Soul</span>
          </>
        }
        description="Natyaarambam Dance Academy is more than a dance school; it is a
              sanctuary where the ancient echoes of temple traditions meet
              the precision of modern mastery."
        primary={{ label: "Enroll Now", onClick: () => goHome("contact") }}
        secondary={{
          label: "Watch Our Gallery",
          onClick: goGallery,
          icon: <Play size={15} aria-hidden="true" />,
        }}
      />

      <section className="overflow-hidden bg-cream-100 py-20 md:py-28" aria-labelledby="legacy-title">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          {/* Collage */}
          <Reveal className="relative">
            <div className="relative mx-auto h-[480px] max-w-[460px] sm:h-[560px]">
              <span className="nd-petal" style={{ left: "-40px", top: "30px", width: 190, height: 190 }} aria-hidden="true" />
              <span className="nd-petal nd-petal--flip" style={{ left: "-70px", top: "170px", width: 150, height: 150 }} aria-hidden="true" />
              <div className="nd-img-zoom absolute right-0 top-0 h-[300px] w-[64%] shadow-xl sm:h-[360px]">
                <Image
                  src="/images/Images/57.webp"
                  alt="Dancer in a red costume performing under warm stage light"
                  fill
                  sizes="(max-width: 640px) 64vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="nd-img-zoom absolute bottom-0 left-0 h-60 w-[58%] border-[6px] border-cream-50 shadow-xl sm:h-[280px]">
                <Image
                  src="/images/salangai.webp"
                  alt="A guru seated outdoors teaching a circle of young students"
                  fill
                  sizes="(max-width: 640px) 58vw, 280px"
                  className="nd-grayscale object-cover"
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
              <figure className="nd-founder-card relative h-[520px] overflow-hidden rounded-md md:h-[600px]">
                <Image
                  src="/images/2.webp"
                  alt="Guru Hema Chandrasekaran in a yellow sari with temple jewelry"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-top"
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
                  <Image
                    src="/images/Portfolio.webp"
                    alt="Hands held in a dance mudra"
                    width={88}
                    height={88}
                    className="h-18 w-18 fixed flex-none rounded-full z-20 border-2 border-gold-500/70 object-cover left-10% right-10 top-[2%] md:h-22 md:w-22"
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
                    India&apos;s classical heritage, ensuring that the timeless
                    legacy of Bharatanatyam flourishes for generations to come.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand id="about-cta-title" />
    </div>
  );
}
