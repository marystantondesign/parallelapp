import { useEffect, useState, type ReactNode } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { MoreHorizontal, Plus } from "lucide-react";
import { AppHeader } from "./shared/AppHeader";

const p = {
  bell: "M15.1626 25.5C14.9429 25.8788 14.6274 26.1933 14.2479 26.4119C13.8684 26.6305 13.4381 26.7456 13.0001 26.7456C12.5622 26.7456 12.1319 26.6305 11.7524 26.4119C11.3728 26.1933 11.0574 25.8788 10.8376 25.5M20.5001 9.25C20.5001 7.26088 19.71 5.35322 18.3034 3.9467C16.8969 2.54018 14.9893 1.75 13.0001 1.75C11.011 1.75 9.10336 2.54018 7.69684 3.9467C6.29031 5.35322 5.50014 7.26088 5.50014 9.25C5.50014 18 1.75014 20.5 1.75014 20.5H24.2501C24.2501 20.5 20.5001 18 20.5001 9.25Z",
  homeBody: "M2.49923 8.33075C2.49917 8.08838 2.55199 7.84892 2.654 7.62906C2.75601 7.40921 2.90476 7.21426 3.08988 7.05781L8.9214 2.06019C9.22213 1.80603 9.60315 1.66658 9.9969 1.66658C10.3906 1.66658 10.7717 1.80603 11.0724 2.06019L16.9039 7.05781C17.089 7.21426 17.2378 7.40921 17.3398 7.62906C17.4418 7.84892 17.4946 8.08838 17.4946 8.33075V15.8284C17.4946 16.2703 17.319 16.6941 17.0066 17.0066C16.6941 17.319 16.2703 17.4946 15.8284 17.4946H4.16538C3.72348 17.4946 3.29969 17.319 2.98723 17.0066C2.67477 16.6941 2.49923 16.2703 2.49923 15.8284V8.33075Z",
  homeDoor: "M12.4961 17.4946V10.83C12.4961 10.609 12.4084 10.3971 12.2521 10.2409C12.0959 10.0847 11.884 9.9969 11.663 9.9969H8.33075C8.1098 9.9969 7.89791 10.0847 7.74168 10.2409C7.58545 10.3971 7.49767 10.609 7.49767 10.83V17.4946",
  moon: "M9.9969 2.49923C9.00265 3.49348 8.44408 4.84198 8.44408 6.24806C8.44408 7.65415 9.00265 9.00265 9.9969 9.9969C10.9912 10.9912 12.3397 11.5497 13.7457 11.5497C15.1518 11.5497 16.5003 10.9912 17.4946 9.9969C17.4946 11.4798 17.0548 12.9294 16.231 14.1624C15.4071 15.3954 14.2362 16.3564 12.8661 16.9238C11.4961 17.4913 9.98858 17.6398 8.53418 17.3505C7.07977 17.0612 5.74381 16.3471 4.69524 15.2986C3.64667 14.25 2.93259 12.914 2.64329 11.4596C2.35399 10.0052 2.50247 8.49768 3.06995 7.12766C3.63743 5.75764 4.59843 4.58667 5.83142 3.76281C7.0644 2.93896 8.514 2.49923 9.9969 2.49923Z",
  twinsBody: "M13.3292 17.4946V15.8284C13.3292 14.9446 12.9781 14.0971 12.3532 13.4721C11.7283 12.8472 10.8807 12.4961 9.9969 12.4961H4.99845C4.11467 12.4961 3.26709 12.8472 2.64216 13.4721C2.01723 14.0971 1.66615 14.9446 1.66615 15.8284V17.4946",
  twinsHead: "M7.49768 9.16383C9.33805 9.16383 10.83 7.6719 10.83 5.83153C10.83 3.99115 9.33805 2.49923 7.49768 2.49923C5.6573 2.49923 4.16538 3.99115 4.16538 5.83153C4.16538 7.6719 5.6573 9.16383 7.49768 9.16383Z",
  twinsBody2: "M18.3276 17.4946V15.8284C18.3271 15.0901 18.0814 14.3729 17.629 13.7893C17.1767 13.2058 16.5433 12.789 15.8284 12.6044",
  twinsHead2: "M13.3292 2.60752C14.046 2.79105 14.6813 3.20792 15.135 3.79242C15.5887 4.37691 15.835 5.09578 15.835 5.83569C15.835 6.5756 15.5887 7.29447 15.135 7.87896C14.6813 8.46346 14.046 8.88033 13.3292 9.06386",
  echoes1: "M1.66615 4.99845C2.166 5.41499 2.66584 5.83153 3.74884 5.83153C5.83152 5.83153 5.83152 4.16538 7.91421 4.16538C10.0802 4.16538 9.91359 5.83153 12.0796 5.83153C14.1623 5.83153 14.1623 4.16538 16.245 4.16538C17.328 4.16538 17.8278 4.58191 18.3276 4.99845",
  echoes2: "M1.66615 9.9969C2.166 10.4134 2.66584 10.83 3.74884 10.83C5.83152 10.83 5.83152 9.16383 7.91421 9.16383C10.0802 9.16383 9.91359 10.83 12.0796 10.83C14.1623 10.83 14.1623 9.16383 16.245 9.16383C17.328 9.16383 17.8278 9.58036 18.3276 9.9969",
  echoes3: "M1.66615 14.9954C2.166 15.4119 2.66584 15.8284 3.74884 15.8284C5.83152 15.8284 5.83152 14.1623 7.91421 14.1623C10.0802 14.1623 9.91359 15.8284 12.0796 15.8284C14.1623 15.8284 14.1623 14.1623 16.245 14.1623C17.328 14.1623 17.8278 14.5788 18.3276 14.9954",
  accountBody: "M15.8284 17.4946V15.8284C15.8284 14.9446 15.4773 14.0971 14.8524 13.4721C14.2275 12.8472 13.3799 12.4961 12.4961 12.4961H7.49768C6.61389 12.4961 5.76631 12.8472 5.14138 13.4721C4.51646 14.0971 4.16538 14.9446 4.16538 15.8284V17.4946",
  accountHead: "M9.9969 9.16383C11.8373 9.16383 13.3292 7.6719 13.3292 5.83153C13.3292 3.99115 11.8373 2.49923 9.9969 2.49923C8.15652 2.49923 6.6646 3.99115 6.6646 5.83153C6.6646 7.6719 8.15652 9.16383 9.9969 9.16383Z",
};

// iOS home-screen apps with a translucent status bar report 100dvh one status-bar
// height short, leaving a blank band under the layout. A standalone app always
// fills the screen, so size to the screen there and fall back to 100dvh elsewhere.
function useAppHeight() {
  const get = () => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (!standalone) return "100dvh";
    const portrait = window.innerHeight >= window.innerWidth;
    const screenHeight = portrait
      ? Math.max(screen.width, screen.height)
      : Math.min(screen.width, screen.height);
    return `${Math.max(screenHeight, window.innerHeight)}px`;
  };
  const [height, setHeight] = useState(get);
  useEffect(() => {
    const update = () => setHeight(get());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  return height;
}

export function Layout() {
  const [hasEchoesSessions, setHasEchoesSessions] = useState(false);
  const location = useLocation();
  const appHeight = useAppHeight();

  useEffect(() => {
    const check = () => {
      const sessions = JSON.parse(localStorage.getItem("echoesSessions") || "[]");
      setHasEchoesSessions(sessions.length > 0);
    };
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [location]);

  const isHome = location.pathname === "/";
  const isEchoesIntro = location.pathname === "/echoes";
  const isEchoesLog = location.pathname === "/echoes/log";

  const isDreamDetailRoute =
    location.pathname.startsWith("/dreams/") &&
    location.pathname !== "/dreams/new";

  const isFullScreen =
    location.pathname.startsWith("/chat/") ||
    location.pathname.startsWith("/echoes/log/") ||
    location.pathname.startsWith("/exchange-sync") ||
    location.pathname.startsWith("/exchange-active") ||
    location.pathname.startsWith("/exchange-transition") ||
    location.pathname.startsWith("/exchange-reflection") ||
    isDreamDetailRoute ||
    (location.pathname.includes("/revisit") && !location.pathname.endsWith("/revisit"));

  const renderHeader = () => {
    const path = location.pathname;
    if (isHome) {
      return (
        <AppHeader
          title={<p className="font-['Idiqlat:Regular',serif] text-[38px] leading-[28px] tracking-[-0.44px] whitespace-nowrap">Parallel</p>}
          right={
            <svg fill="none" height="24" viewBox="0 0 26 28.5" width="22" aria-label="Notifications" className="text-t-text-primary">
              <path d={p.bell} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
            </svg>
          }
        />
      );
    }
    if (isEchoesIntro) {
      return (
        <AppHeader
          variant="dark"
          title="Echoes"
          right={hasEchoesSessions
            ? <Link to="/echoes/log" className="text-white/60 text-sm active:text-white">Log</Link>
            : <span className="text-zinc-600 text-sm">Log</span>}
        />
      );
    }
    if (isEchoesLog) {
      return <AppHeader title="Echoes Log" right={<Link to="/echoes" className="text-t-link text-sm">New</Link>} />;
    }
    if (path === "/twins") {
      return (
        <AppHeader
          title="Twins"
          right={<Link to="/discover" aria-label="Discover twins" className="text-t-text-primary"><MoreHorizontal className="w-6 h-6" /></Link>}
        />
      );
    }
    if (path === "/discover") {
      return <AppHeader title="Discover" right={<Link to="/twins" className="text-t-link text-sm">Chats</Link>} />;
    }
    if (path === "/dreams") {
      return (
        <AppHeader
          title="Dreams"
          right={<Link to="/dreams/new" aria-label="New dream" className="text-t-text-primary"><Plus className="w-6 h-6" /></Link>}
        />
      );
    }
    const titles: Record<string, string> = {
      "/settings": "Profile",
      "/settings/profile": "Profile",
      "/settings/account": "Account",
      "/settings/profile/vibe": "Choose Vibe",
      "/insights": "Insights",
      "/account": "Account",
      "/dreams/new": "Dreams",
      "/echoes/session": "Echoes",
    };
    return <AppHeader title={titles[path] ?? "Parallel"} />;
  };

  const isNavActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/twins") return location.pathname === "/twins" || location.pathname.startsWith("/chat") || location.pathname.startsWith("/profile") || location.pathname === "/discover";
    if (path === "/dreams") return location.pathname.startsWith("/dreams");
    if (path === "/echoes") return location.pathname.startsWith("/echoes");
    if (path === "/settings") return location.pathname === "/account" || location.pathname.startsWith("/settings");
    return false;
  };

  const stroke = (path: string) => isNavActive(path) ? "var(--t-icon-active)" : "var(--t-icon-inactive)";

  // Pick a header bg color for the home-indicator / status-bar area on full-screen routes
  const fullScreenTopColor = isDreamDetailRoute ? "#172554"
    : location.pathname.startsWith("/echoes/log/") ? "#18181b"
    : location.pathname.startsWith("/exchange") ? "#2e0f65"
    : "#000";

  return (
    // Fill the viewport exactly (see useAppHeight) so nothing shows below the layout
    <div
      className="w-full flex flex-col overflow-hidden bg-black"
      style={{ height: appHeight }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      {!isFullScreen && !location.pathname.startsWith("/profile/") && renderHeader()}

      {/* For full-screen routes: a colored cap behind the real status bar */}
      {isFullScreen && (
        <div
          className="flex-none"
          style={{ height: "env(safe-area-inset-top, 0px)", backgroundColor: fullScreenTopColor }}
        />
      )}

      {/* ── Main scrollable area ─────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-t-app-bg">
        <Outlet />
      </main>

      {/* ── Bottom Navigation ───────────────────────────── */}
      {!isFullScreen && (
        <nav className="bg-t-nav-bg border-t border-t-nav-border flex-none">
          <div className="flex items-start pt-1">
            <NavItem to="/" label="Home" active={isNavActive("/")}>
              <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                <path d={p.homeBody} stroke={stroke("/")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                <path d={p.homeDoor} stroke={stroke("/")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
              </svg>
            </NavItem>
            <NavItem to="/dreams" label="Dreams" active={isNavActive("/dreams")}>
              <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                <path d={p.moon} stroke={stroke("/dreams")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
              </svg>
            </NavItem>
            <NavItem to="/twins" label="Twins" active={isNavActive("/twins")}>
              <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                <path d={p.twinsBody} stroke={stroke("/twins")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                <path d={p.twinsHead} stroke={stroke("/twins")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                <path d={p.twinsBody2} stroke={stroke("/twins")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                <path d={p.twinsHead2} stroke={stroke("/twins")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
              </svg>
            </NavItem>
            <NavItem to="/echoes" label="Echoes" active={isNavActive("/echoes")}>
              <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                <path d={p.echoes1} stroke={stroke("/echoes")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                <path d={p.echoes2} stroke={stroke("/echoes")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                <path d={p.echoes3} stroke={stroke("/echoes")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
              </svg>
            </NavItem>
            <NavItem to="/settings" label="Profile" active={isNavActive("/settings")}>
              <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                <path d={p.accountBody} stroke={stroke("/settings")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                <path d={p.accountHead} stroke={stroke("/settings")} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
              </svg>
            </NavItem>
          </div>
          {/* Home indicator clearance */}
          <div style={{ height: "max(env(safe-area-inset-bottom, 0px), 8px)" }} />
        </nav>
      )}
    </div>
  );
}

function NavItem({ to, label, active, children }: { to: string; label: string; active: boolean; children: ReactNode }) {
  return (
    <Link to={to} className="flex-1 flex flex-col gap-[3px] items-center py-2">
      {children}
      <span className={`text-[10px] leading-none tracking-[0.12px] ${active ? "font-medium text-t-text-primary" : "font-normal text-t-text-muted"}`}>{label}</span>
    </Link>
  );
}
