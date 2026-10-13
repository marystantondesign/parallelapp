import { Link } from "react-router";
import { useEffect, useState, type ReactNode } from "react";

const defaultDreams = [
  { id: "1", title: "The Blue River", date: "2024-03-04" },
  { id: "2", title: "Garden of Glass", date: "2024-03-01" },
  { id: "3", title: "The Forgotten Library", date: "2024-02-28" },
  { id: "4", title: "Endless Staircase", date: "2024-02-25" },
  { id: "5", title: "Mirror City", date: "2024-02-22" },
  { id: "6", title: "The White Room", date: "2024-02-19" },
];

const defaultEchoesSessions = [
  { id: "1", date: "2024-03-05", duration: 22, location: "Coastal village", occupation: "Fisher", period: "1800s" },
  { id: "2", date: "2024-02-20", duration: 18, location: "Coastal village", occupation: "Healer", period: "1400s" },
  { id: "3", date: "2024-01-15", duration: 25, location: "Mountain monastery", occupation: "Scholar", period: "900s" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="app-label">{label}</p>
      <p className="text-sm font-medium font-mono tabular-nums text-t-text-primary">{value}</p>
    </div>
  );
}

function CardHeader({ title, to, accent }: { title: string; to: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-1.5">
        {accent && (
          <span
            className="rounded-full flex-shrink-0"
            style={{ width: 7, height: 7, backgroundColor: accent }}
          />
        )}
        <p className="app-label tracking-widest">{title}</p>
      </div>
      <Link to={to} className="text-xs text-t-text-muted">View all</Link>
    </div>
  );
}

function Card({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <div
      className="app-card flex flex-col items-start"
      style={accent ? { borderLeft: `3px solid ${accent}` } : undefined}
    >
      {children}
    </div>
  );
}

function StatsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-2 pt-3 w-full">
      {children}
    </div>
  );
}

function Highlight({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-center justify-between w-full mt-2 pt-1.5 border-t border-t-border-subtle">
      <p className="app-label">{label}</p>
      <p className="text-xs font-mono text-t-text-primary">{title}</p>
    </div>
  );
}

export function Home() {
  const [dreams, setDreams] = useState(defaultDreams);
  const [echoesSessions, setEchoesSessions] = useState(defaultEchoesSessions);
  const [revisitExperiences, setRevisitExperiences] = useState<any[]>([]);
  const [userName, setUserName] = useState("Mereh");
  const [now] = useState(new Date());

  useEffect(() => {
    const savedDreams = JSON.parse(localStorage.getItem("dreams") || "[]");
    if (savedDreams.length > 0) setDreams(savedDreams);

    const savedEchoes = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
    if (savedEchoes.length > 0) setEchoesSessions(savedEchoes);

    const savedRevisits = JSON.parse(localStorage.getItem("dreamRevisitExperiences") || "[]");
    setRevisitExperiences(savedRevisits);

    const account = JSON.parse(localStorage.getItem("userAccount") || "{}");
    if (account.name) setUserName(account.name);
  }, []);

  const totalDreams = dreams.length;
  const dreamsThisMonth = dreams.filter(d => {
    const date = new Date(d.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  const totalRevisits = revisitExperiences.length;
  const uniqueRevisited = new Set(revisitExperiences.map((r: any) => r.dreamId)).size;
  const revisitCounts: Record<string, { count: number; title: string }> = {};
  revisitExperiences.forEach((r: any) => {
    const dream = dreams.find(d => d.id === r.dreamId);
    if (!revisitCounts[r.dreamId]) revisitCounts[r.dreamId] = { count: 0, title: dream?.title || "Unknown" };
    revisitCounts[r.dreamId].count++;
  });
  const mostRevisited = Object.values(revisitCounts).sort((a, b) => b.count - a.count)[0];

  const totalEchoes = echoesSessions.length;
  const echoesThisMonth = echoesSessions.filter((s: any) => {
    const date = new Date(s.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  const avgDuration = echoesSessions.length
    ? Math.round(echoesSessions.reduce((sum: number, s: any) => sum + (s.duration || 20), 0) / echoesSessions.length)
    : 0;
  const locationCounts: Record<string, number> = {};
  echoesSessions.forEach((s: any) => { if (s.location) locationCounts[s.location] = (locationCounts[s.location] || 0) + 1; });
  const topLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const occupationCounts: Record<string, number> = {};
  echoesSessions.forEach((s: any) => { if (s.occupation) occupationCounts[s.occupation] = (occupationCounts[s.occupation] || 0) + 1; });
  const topOccupation = Object.entries(occupationCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const earliestPeriod = echoesSessions.map((s: any) => s.period).filter(Boolean).sort()[0];

  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex flex-col items-start pb-4 pt-2.5 px-4 gap-3">

      {/* Welcome */}
      <div className="flex items-start justify-between w-full pb-2 gap-3">
        <div className="min-w-0">
          <p className="text-base text-t-text-tertiary">{getGreeting()}</p>
          <p className="text-3xl font-bold text-t-text-primary leading-tight">{userName}</p>
          <p className="text-sm text-t-text-muted pt-1">{"Here's your continuity overview."}</p>
        </div>
        <div className="flex flex-col items-end pt-1 shrink-0">
          <p className="text-sm text-t-text-muted text-right">{dateStr}</p>
          <p className="text-sm text-t-text-muted text-right">{timeStr}</p>
        </div>
      </div>

      {/* Dreams Card */}
      <Card accent="var(--t-accent-dreams)">
        <CardHeader title="Dreams" to="/dreams" accent="var(--t-accent-dreams)" />
        <StatsGrid>
          <StatItem label="Recorded" value={totalDreams} />
          <StatItem label="This month" value={dreamsThisMonth} />
          <StatItem label="Revisits" value={totalRevisits || 1} />
          <StatItem label="Revisited" value={uniqueRevisited || 1} />
          <StatItem label="Symbol" value="Water" />
          <StatItem label="Location" value="Libraries" />
        </StatsGrid>
        <Highlight
          label="Most revisited dream"
          title={mostRevisited ? mostRevisited.title : "The Blue River"}
        />
      </Card>

      {/* Twins Card */}
      <Card accent="var(--t-accent-twins)">
        <CardHeader title="Twins" to="/twins" accent="var(--t-accent-twins)" />
        <StatsGrid>
          <StatItem label="Matches" value={2} />
          <StatItem label="Active" value={5} />
          <StatItem label="New" value={2} />
          <StatItem label="Messages" value={184} />
          <StatItem label="Avg divergence" value="34%" />
          <StatItem label="Video" value={0} />
        </StatsGrid>
      </Card>

      {/* Echoes Card */}
      <Card accent="var(--t-accent-echoes)">
        <CardHeader title="Echoes" to="/echoes" accent="var(--t-accent-echoes)" />
        <StatsGrid>
          <StatItem label="Sessions" value={totalEchoes} />
          <StatItem label="This month" value={echoesThisMonth} />
          <StatItem label="Earliest era" value={earliestPeriod || "900s"} />
          <StatItem label="Avg length" value={`${avgDuration || 20} min`} />
          <StatItem label="Location" value={topLocation || "Coastal village"} />
          <StatItem label="Occupation" value={topOccupation || "Fisher"} />
        </StatsGrid>
      </Card>

      {/* Insights Card */}
      <Card>
        <CardHeader title="Insights" to="/insights" />
        <p className="text-sm text-t-text-secondary leading-relaxed pt-2">
          {[
            "Water appears in 6 dreams.",
            "Libraries appear in 11 Echoes sessions.",
            "Wonder is your most common emotion.",
            "“Mirror City” has been revisited 5 times.",
            "Coastal villages appear in multiple Echoes sessions.",
          ].join(" ")}
        </p>
      </Card>

    </div>
  );
}
