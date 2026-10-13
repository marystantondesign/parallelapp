import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";

function MetaSetup() {
  useEffect(() => {
    const vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");

    const setMeta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement("meta");
        m.name = name;
        document.head.appendChild(m);
      }
      m.content = content;
    };

    setMeta("apple-mobile-web-app-capable", "yes");
    setMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
  }, []);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <MetaSetup />
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(46,16,101,0.95)",
            border: "0px solid rgba(168,85,247,0.3)",
            color: "white",
            fontSize: "13px",
            backdropFilter: "blur(8px)",
          },
        }}
      />
    </ThemeProvider>
  );
}
