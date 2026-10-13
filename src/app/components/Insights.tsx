import { useEffect, useState, useMemo, type ReactNode } from "react";
import { Link } from "react-router";
import { Search, Mic } from "lucide-react";

const defaultDreams = [
  { id: "1", title: "The Blue River", date: "2024-03-04", description: "Standing at the edge of a vast blue river, unnaturally still like glass.", symbols: ["water", "river", "stillness"], emotion: "wonder" },
  { id: "2", title: "Garden of Glass", date: "2024-03-01", description: "A garden where every plant was made of translucent glass. A library stood at the center.", symbols: ["glass", "garden", "library"], emotion: "awe" },
  { id: "3", title: "The Forgotten Library", date: "2024-02-28", description: "An enormous library with books unopened for centuries. Water dripped from the ceiling.", symbols: ["library", "books", "water"], emotion: "melancholy" },
  { id: "4", title: "Endless Staircase", date: "2024-02-25", description: "Climbing stairs that never ended. Architecture shifting between stone and glass.", symbols: ["stairs", "glass", "architecture"], emotion: "anxiety" },
  { id: "5", title: "Mirror City", date: "2024-02-22", description: "A city where every surface was reflective. Infinite versions of myself. A library district.", symbols: ["mirror", "reflection", "library"], emotion: "wonder" },
  { id: "6", title: "The White Room", date: "2024-02-19", description: "An empty white room with water slowly rising from the floor. Only curiosity.", symbols: ["water", "emptiness", "white"], emotion: "curiosity" },
];

function countItems(items: string[]): [string, number][] {
  const map: Record<string, number> = {};
  items.forEach(v => { if (v) map[v] = (map[v] || 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-t-text-secondary w-24 shrink-0 capitalize truncate">{label}</p>
      <div className="flex-1 h-1.5 bg-t-surface-subtle rounded-full overflow-hidden">
        <div className="h-full bg-t-text-muted rounded-full transition-all" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }} />
      </div>
      <p className="text-xs text-t-text-muted w-4 text-right shrink-0">{value}</p>
    </div>
  );
}

function BigStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-2xl font-bold text-t-text-primary leading-none">{value}</p>
      <p className="text-xs text-t-text-muted">{label}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-t-text-primary mb-3">{children}</h2>
  );
}

function EmptyCard({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="app-card">
      <p className="text-sm text-t-text-muted leading-relaxed">{message}</p>
      {sub && <p className="text-xs text-t-text-muted leading-relaxed mt-2">{sub}</p>}
    </div>
  );
}

function matchesSearch(q: string, ...fields: (string | undefined)[]): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some(f => f?.toLowerCase().includes(lower));
}

export function Insights() {
  const [query, setQuery] = useState("");

  const [dreams, setDreams] = useState(defaultDreams as any[]);
  const [revisitExperiences, setRevisitExperiences] = useState<any[]>([]);
  const [echoesSessions, setEchoesSessions] = useState<any[]>([]);
  const [exchangeReflections, setExchangeReflections] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dreams") || "[]");
    if (saved.length > 0) setDreams(saved);

    const savedRevisits = JSON.parse(localStorage.getItem("dreamRevisitExperiences") || "[]");
    setRevisitExperiences(savedRevisits);

    // Only real echoes sessions — user hasn't done one yet, so this stays empty
    const savedEchoes = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
    setEchoesSessions(savedEchoes);

    const allReflections = JSON.parse(localStorage.getItem("exchangeReflections") || "{}");
    const flat = (Object.values(allReflections) as any[][]).flat();
    setExchangeReflections(flat.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  // ── Dream computations ──
  const allSymbols = useMemo(() => dreams.flatMap((d: any) => d.symbols || []), [dreams]);
  const symbolCounts = useMemo(() => countItems(allSymbols), [allSymbols]);
  const emotionCounts = useMemo(() => countItems(dreams.map((d: any) => d.emotion || "")), [dreams]);
  const topEmotion = emotionCounts[0]?.[0] ?? "wonder";

  const filteredDreams = useMemo(() =>
    dreams.filter((d: any) =>
      matchesSearch(query, d.title, d.description, d.emotion, ...(d.symbols || []))
    ), [dreams, query]);

  const filteredSymbols = useMemo(() => {
    if (!query) return symbolCounts;
    return symbolCounts.filter(([sym]) => sym.toLowerCase().includes(query.toLowerCase()));
  }, [symbolCounts, query]);

  // ── Revisit computations ──
  const revisitCounts = useMemo(() => {
    const map: Record<string, { count: number; title: string; hasNotes: boolean; hasAudio: boolean }> = {};
    revisitExperiences.forEach((r: any) => {
      const dream = dreams.find((d: any) => d.id === r.dreamId);
      if (!map[r.dreamId]) map[r.dreamId] = { count: 0, title: dream?.title || "Unknown Dream", hasNotes: false, hasAudio: false };
      map[r.dreamId].count++;
      if (r.notes) map[r.dreamId].hasNotes = true;
      if (r.hasAudio) map[r.dreamId].hasAudio = true;
    });
    return Object.entries(map).map(([dreamId, v]) => ({ dreamId, ...v })).sort((a, b) => b.count - a.count);
  }, [revisitExperiences, dreams]);

  const filteredRevisits = useMemo(() =>
    revisitExperiences.filter((r: any) => {
      const dream = dreams.find((d: any) => d.id === r.dreamId);
      return matchesSearch(query, dream?.title, r.notes);
    }), [revisitExperiences, dreams, query]);

  // ── Echoes computations ──
  const filteredEchoes = useMemo(() =>
    echoesSessions.filter((s: any) =>
      matchesSearch(query, s.location, s.occupation, s.period, s.notes)
    ), [echoesSessions, query]);

  const echoLocationCounts = useMemo(() => countItems(echoesSessions.map((s: any) => s.location || "")), [echoesSessions]);
  const echoOccupationCounts = useMemo(() => countItems(echoesSessions.map((s: any) => s.occupation || "")), [echoesSessions]);

  // ── Exchange computations ──
  const filteredExchanges = useMemo(() =>
    exchangeReflections.filter((r: any) =>
      matchesSearch(query, r.notes)
    ), [exchangeReflections, query]);

  const maxSymbol = filteredSymbols[0]?.[1] || 1;
  const maxLocation = echoLocationCounts[0]?.[1] || 1;
  const maxOccupation = echoOccupationCounts[0]?.[1] || 1;
  const maxRevisit = revisitCounts[0]?.count || 1;

  const hasQuery = query.trim().length > 0;

  return (
    <div className="px-4 py-5 space-y-8 pb-8">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-text-placeholder" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search symbols, emotions, locations…"
          className="app-input w-full pl-10"
        />
      </div>

      {/* ── Dreams ── */}
      {(!hasQuery || filteredDreams.length > 0 || filteredSymbols.length > 0) && (
      <section>
        <SectionTitle>Dreams</SectionTitle>
        <div className="app-card space-y-6">

          {/* Recurring Symbols — always first */}
          {filteredSymbols.length > 0 ? (
            <div>
              <p className="app-field-label mb-3">Recurring Symbols</p>
              <div className="space-y-2.5">
                {filteredSymbols.slice(0, 8).map(([sym, ct]) => (
                  <BarRow key={sym} label={sym} value={ct} max={maxSymbol} />
                ))}
              </div>
            </div>
          ) : hasQuery ? (
            <p className="text-sm text-t-text-muted">No symbols match "{query}"</p>
          ) : null}

          {/* Dream entries */}
          {filteredDreams.length > 0 && (
            <div>
              <p className="app-field-label mb-3">Dream Entries</p>
              <div className="space-y-0">
                {filteredDreams.slice(0, 6).map((dream: any, i: number) => (
                  <Link
                    key={dream.id}
                    to={`/dreams/${dream.id}`}
                    className={`flex items-start justify-between py-2.5 gap-3 active:opacity-60 ${i < filteredDreams.slice(0, 6).length - 1 ? "border-b border-t-border-subtle" : ""}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-t-text-primary truncate">{dream.title}</p>
                      <p className="app-caption">{new Date(dream.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    {dream.emotion && (
                      <span className="text-xs text-t-text-muted shrink-0 capitalize mt-0.5">{dream.emotion}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Big stats — bottom of card */}
          <div className="flex gap-6 pt-2 border-t border-t-border-subtle">
            <BigStat value={dreams.length} label="dreams logged" />
            <BigStat value={topEmotion} label="most common emotion" />
          </div>
        </div>
      </section>
      )}

      {/* ── Dream Revisits ── */}
      {(!hasQuery || filteredRevisits.length > 0) && (
      <section>
        <SectionTitle>Dream Revisits</SectionTitle>
        {revisitExperiences.length === 0 ? (
          <EmptyCard
            message="No revisit sessions recorded yet."
            sub="Notes and audio recordings from dream revisit sessions will appear here."
          />
        ) : (
          <div className="app-card space-y-6">

            {/* Most revisited bars */}
            {revisitCounts.length > 0 && (
              <div>
                <p className="app-field-label mb-3">Most Revisited Dreams</p>
                <div className="space-y-2.5">
                  {revisitCounts.slice(0, 5).map(entry => (
                    <BarRow key={entry.dreamId} label={entry.title} value={entry.count} max={maxRevisit} />
                  ))}
                </div>
              </div>
            )}

            {/* Notes and recordings */}
            {filteredRevisits.some((r: any) => r.notes || r.hasAudio) ? (
              <div>
                <p className="app-field-label mb-3">Recordings &amp; Notes</p>
                <div className="space-y-0">
                  {filteredRevisits
                    .filter((r: any) => r.notes || r.hasAudio)
                    .map((r: any, i: number, arr: any[]) => {
                      const dream = dreams.find((d: any) => d.id === r.dreamId);
                      return (
                        <div key={i} className={`py-2.5 ${i < arr.length - 1 ? "border-b border-t-border-subtle" : ""}`}>
                          <p className="text-sm text-t-text-primary">{dream?.title || "Unknown Dream"}</p>
                          <p className="app-caption mb-1">{new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                          {r.hasAudio && (
                            <div className="flex items-center gap-1.5">
                              <Mic className="w-3 h-3 text-t-text-muted" />
                              <span className="text-xs text-t-text-muted">Audio recording</span>
                            </div>
                          )}
                          {r.notes && <p className="text-xs text-t-text-secondary mt-1 leading-relaxed italic">"{r.notes.slice(0, 100)}{r.notes.length > 100 ? "…" : ""}"</p>}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-t-text-muted leading-relaxed">Notes and audio recordings from your sessions will appear here.</p>
            )}

            {/* Big stats — bottom */}
            <div className="flex gap-6 pt-2 border-t border-t-border-subtle">
              <BigStat value={revisitExperiences.length} label="sessions total" />
              <BigStat value={Object.keys(revisitCounts).length} label="dreams revisited" />
            </div>
          </div>
        )}
      </section>
      )}

      {/* ── Echoes ── */}
      {(!hasQuery || filteredEchoes.length > 0) && (
      <section>
        <SectionTitle>Echoes</SectionTitle>
        {echoesSessions.length === 0 ? (
          <EmptyCard
            message="No Echoes sessions recorded yet."
            sub="Recurring locations, occupations, and time periods encountered during past-life sessions will appear here, along with any session notes and Jungian analysis."
          />
        ) : (
          <div className="app-card space-y-6">

            {echoLocationCounts.length > 0 && (
              <div>
                <p className="app-field-label mb-3">Recurring Locations</p>
                <div className="space-y-2.5">
                  {echoLocationCounts.map(([loc, ct]) => (
                    <BarRow key={loc} label={loc} value={ct} max={maxLocation} />
                  ))}
                </div>
              </div>
            )}

            {echoOccupationCounts.length > 0 && (
              <div>
                <p className="app-field-label mb-3">Recurring Occupations</p>
                <div className="space-y-2.5">
                  {echoOccupationCounts.map(([occ, ct]) => (
                    <BarRow key={occ} label={occ} value={ct} max={maxOccupation} />
                  ))}
                </div>
              </div>
            )}

            {filteredEchoes.some((s: any) => s.notes) ? (
              <div>
                <p className="app-field-label mb-3">Session Notes</p>
                <div className="space-y-0">
                  {filteredEchoes.filter((s: any) => s.notes).map((s: any, i: number, arr: any[]) => (
                    <div key={s.id} className={`py-2.5 ${i < arr.length - 1 ? "border-b border-t-border-subtle" : ""}`}>
                      <p className="app-caption mb-1">{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {s.duration} min · {s.location}</p>
                      <p className="text-xs text-t-text-secondary leading-relaxed italic">"{s.notes.slice(0, 120)}{s.notes.length > 120 ? "…" : ""}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-t-text-muted leading-relaxed">Session notes and analysis from your Echoes experiences will appear here.</p>
            )}

            {/* Big stats — bottom */}
            <div className="flex gap-6 pt-2 border-t border-t-border-subtle">
              <BigStat value={echoesSessions.length} label="sessions" />
              {echoesSessions.map((s: any) => s.period).filter(Boolean).sort()[0] && (
                <BigStat value={echoesSessions.map((s: any) => s.period).filter(Boolean).sort()[0]} label="earliest period" />
              )}
            </div>
          </div>
        )}
      </section>
      )}

      {/* ── Exchange Reflections ── */}
      {(!hasQuery || filteredExchanges.length > 0) && (
      <section>
        <SectionTitle>Exchange Reflections</SectionTitle>
        {exchangeReflections.length === 0 ? (
          <EmptyCard
            message="No exchange reflections recorded yet."
            sub="After completing a Parallel Exchange, you can record a reflection. Those notes and recordings will appear here. Chat conversations remain encrypted and private."
          />
        ) : (
          <div className="app-card space-y-6">
            {filteredExchanges.length > 0 ? (
              <div className="space-y-0">
                {filteredExchanges.map((r: any, i: number, arr: any[]) => (
                  <div key={i} className={`py-2.5 ${i < arr.length - 1 ? "border-b border-t-border-subtle" : ""}`}>
                    <p className="text-sm text-t-text-primary">Exchange Reflection</p>
                    <p className="app-caption mb-1">
                      {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {r.duration} min
                    </p>
                    {r.hasAudio && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Mic className="w-3 h-3 text-t-text-muted" />
                        <span className="text-xs text-t-text-muted">Audio recording</span>
                      </div>
                    )}
                    {r.notes && (
                      <p className="text-xs text-t-text-secondary mt-1 leading-relaxed italic">
                        "{r.notes.slice(0, 120)}{r.notes.length > 120 ? "…" : ""}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-t-text-muted">No reflections match "{query}"</p>
            )}

            {/* Big stats — bottom */}
            <div className="flex gap-6 pt-2 border-t border-t-border-subtle">
              <BigStat value={exchangeReflections.length} label="reflections recorded" />
            </div>
          </div>
        )}
      </section>
      )}

      <p className="text-xs text-t-text-muted text-center leading-relaxed pb-2">
        Insights are drawn from your personal records only.<br />Chat conversations are excluded and remain private.
      </p>

    </div>
  );
}
