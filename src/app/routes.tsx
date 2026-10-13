import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Parallels } from "./components/Parallels";
import { Discover } from "./components/Discover";
import { ParallelChat } from "./components/ParallelChat";
import { ParallelProfile } from "./components/ParallelProfile";
import { Dreams } from "./components/Dreams";
import { DreamDetail } from "./components/DreamDetail";
import { LogDream } from "./components/LogDream";
import { DreamRevisit } from "./components/DreamRevisit";
import { Echoes } from "./components/Echoes";
import { EchoesSession } from "./components/EchoesSession";
import { EchoesLog } from "./components/EchoesLog";
import { EchoesLogDetail } from "./components/EchoesLogDetail";
import { Settings } from "./components/Settings";
import { Profile } from "./components/Profile";
import { ChooseVibe } from "./components/ChooseVibe";
import { Account } from "./components/Account";
import { ExchangeSynchronization } from "./components/ExchangeSynchronization";
import { ExchangeSwapTransition } from "./components/ExchangeSwapTransition";
import { ActiveExchange } from "./components/ActiveExchange";
import { ExchangeReflection } from "./components/ExchangeReflection";
import { ReflectionDetail } from "./components/ReflectionDetail";
import { Onboarding } from "./components/Onboarding";
import { Insights } from "./components/Insights";

export const router = createBrowserRouter([
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "twins", Component: Parallels },
      { path: "discover", Component: Discover },
      { path: "chat/:id", Component: ParallelChat },
      { path: "profile/:id", Component: ParallelProfile },
      { path: "profile/:id/reflection/:reflectionId", Component: ReflectionDetail },
      { path: "dreams", Component: Dreams },
      { path: "dreams/new", Component: LogDream },
      { path: "dreams/:id", Component: DreamDetail },
      { path: "dreams/:id/revisit", Component: DreamRevisit },
      { path: "echoes", Component: Echoes },
      { path: "echoes/session", Component: EchoesSession },
      { path: "echoes/log", Component: EchoesLog },
      { path: "echoes/log/:id", Component: EchoesLogDetail },
      { path: "settings", Component: Settings },
      { path: "settings/profile", Component: Profile },
      { path: "settings/profile/vibe", Component: ChooseVibe },
      { path: "account", Component: Account },
      { path: "settings/account", Component: Account },
      { path: "insights", Component: Insights },
      { path: "exchange-sync/:id", Component: ExchangeSynchronization },
      { path: "exchange-transition/:id", Component: ExchangeSwapTransition },
      { path: "exchange-active/:id", Component: ActiveExchange },
      { path: "exchange-reflection/:id", Component: ExchangeReflection },
    ],
  },
]);