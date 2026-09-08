import type { Metadata } from "next";
import { getContactStats, listContactSubmissions } from "@/lib/contact-submissions";

export const metadata: Metadata = {
  title: "Admin Inbox",
  description: "Review contact form submissions.",
};

export const dynamic = "force-dynamic";

function valueFrom(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const status = valueFrom(params, "status") || "all";
  const query = valueFrom(params, "q");
  const stats = await getContactStats();
  const messages = await listContactSubmissions({ status, search: query, limit: 100 });

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="nd-eyebrow">Support team</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-maroon-800">Contact Inbox</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-500">
            Review submissions captured from the contact form and follow up with families.
          </p>
        </div>

        <form className="flex flex-col gap-3 md:flex-row md:items-end" method="get">
          <div className="nd-field">
            <label htmlFor="q">Search</label>
            <input id="q" name="q" defaultValue={query} placeholder="Name, email, phone, message..." />
          </div>
          <div className="nd-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={status}>
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
          <button type="submit" className="nd-btn nd-btn--maroon">
            Filter
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total messages" value={stats.total} />
        <SummaryCard label="New" value={stats.newCount} />
        <SummaryCard label="Read" value={stats.readCount} />
        <SummaryCard label="Replied" value={stats.repliedCount} />
      </div>

      <div className="mt-8 space-y-4">
        {messages.length === 0 ? (
          <div className="rounded-3xl border border-maroon-800/10 bg-cream-50 p-8 text-center text-sm text-ink-500">
            No messages found.
          </div>
        ) : (
          messages.map((message) => (
            <article key={message.id} className="rounded-3xl border border-maroon-800/10 bg-cream-50 p-6 shadow-[0_12px_30px_rgba(94,35,35,0.06)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl font-bold text-maroon-800">{message.name}</h2>
                    <StatusBadge status={message.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink-500">
                    {message.level || "Unknown level"}{message.age ? ` • Age ${message.age}` : ""}
                  </p>
                </div>
                <p className="text-sm text-ink-400">{formatDate(message.createdAt)}</p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoRow label="Phone" value={message.phone || "-"} />
                <InfoRow label="Email" value={message.email || "-"} />
                <InfoRow label="Guardian" value={message.guardian || "-"} />
                <InfoRow label="Source" value={message.source || "-"} />
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-ink-700">Message</p>
                <div className="mt-2 rounded-2xl bg-white/80 p-4 text-sm leading-relaxed text-ink-700 whitespace-pre-wrap">
                  {message.message || "-"}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-maroon-800/10 bg-cream-50 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-maroon-800">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-400">{label}</p>
      <p className="mt-1 break-words text-sm text-ink-700">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = status === "read" ? "Read" : status === "replied" ? "Replied" : "New";
  const tone =
    status === "read"
      ? "bg-gold-300/30 text-maroon-800"
      : status === "replied"
        ? "bg-cream-200 text-maroon-800"
        : "bg-maroon-700/10 text-maroon-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${tone}`}>{label}</span>;
}
