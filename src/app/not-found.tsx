import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[760px] px-5 py-24 text-center md:px-8">
      <p className="nd-eyebrow">Page Not Found</p>
      <h1 className="mt-4 font-display text-[2.4rem] font-bold text-maroon-800">
        This page has moved.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-ink-500">
        Return to the academy home page to continue exploring Natyaarambam.
      </p>
      <Link href="/" className="nd-btn nd-btn--maroon mt-8">
        Back Home
      </Link>
    </section>
  );
}
