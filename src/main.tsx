import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initI18n } from "./i18n";
import { enableNativeTouch } from "./native";

// Language first: sets the page direction/title and starts translating the
// remote app's screens as soon as they appear.
initI18n();

// Native-feel touch: no rubber-banding, no tap highlight, no long-press menu.
enableNativeTouch();

// Installable PWA shell: standalone display, cached app shell, faster repeat
// launches. The tutor still needs a network connection for live AI sessions.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const url = new URL("sw.js", document.baseURI);
    void navigator.serviceWorker.register(url.href).catch(() => undefined);
  }, { once: true });
}

// The host React tree only shows the loader / error screen.
// The real Maalam app is mounted into #root with its own React (from esm.sh).
createRoot(document.getElementById("host")!).render(<App />);
