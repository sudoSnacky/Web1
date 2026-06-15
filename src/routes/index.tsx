import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { Window, type WindowState } from "@/components/desktop/Window";
import { Notepad, Calculator, AboutMe, Paint, Guestbook, Terminal } from "@/components/desktop/apps";
import { NetscapeNavigator } from "@/components/desktop/NetscapeNavigator";
import { Minesweeper } from "@/components/desktop/Minesweeper";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { BSODSystem } from "@/components/desktop/BSODSystem";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Webcore OS — A Web 1.0 Desktop" },
      { name: "description", content: "A nostalgic mini desktop in your browser. Notepad, Paint, Calculator, Guestbook, Terminal — all in glorious Web 1.0 aesthetic." },
      { property: "og:title", content: "Webcore OS — A Web 1.0 Desktop" },
      { property: "og:description", content: "A nostalgic mini desktop in your browser." },
    ],
  }),
  component: Desktop,
});

interface AppDef {
  id: string;
  title: string;
  icon: string;
  render: () => React.ReactNode;
  width: number;
  height: number;
}

// Minesweeper is hidden from the desktop icon grid until unlocked via Konami Code.
// It lives in ALL_APPS so the window manager can render it when openApp("mines") fires.
const APPS: AppDef[] = [
  { id: "browser", title: "Netscape Navigator", icon: "🌐", width: 660, height: 520, render: () => <NetscapeNavigator /> },
  { id: "about", title: "Welcome.htm — Netscape", icon: "📄", width: 460, height: 420, render: () => <AboutMe /> },
  { id: "notepad", title: "Untitled — Notepad", icon: "📝", width: 420, height: 320, render: () => <Notepad /> },
  { id: "calc", title: "Calculator", icon: "🧮", width: 220, height: 280, render: () => <Calculator /> },
  { id: "paint", title: "untitled — Paint", icon: "🎨", width: 520, height: 440, render: () => <Paint /> },
  { id: "guestbook", title: "Guestbook.exe", icon: "📖", width: 380, height: 420, render: () => <Guestbook /> },
  { id: "terminal", title: "MS-DOS Prompt", icon: "💻", width: 460, height: 320, render: () => <Terminal /> },
  { id: "mines", title: "Minesweeper", icon: "💣", width: 360, height: 430, render: () => <Minesweeper /> },
];

function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [konamiToast, setKonamiToast] = useState(false);
  const [minesUnlocked, setMinesUnlocked] = useState(false);
  const zRef = useRef(10);
  const openedOnce = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerBSOD = useRef<(() => void) | null>(null);
  const registerCrash = useCallback((fn: () => void) => { triggerBSOD.current = fn; }, []);
  const crash = useCallback(() => triggerBSOD.current?.(), []);

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setClock(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // ── Konami Code handler ───────────────────────────────────────────────────
  const onKonami = useCallback(() => {
    // Show the toast
    setKonamiToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setKonamiToast(false), 2800);
    // Unlock the Minesweeper desktop icon
    setMinesUnlocked(true);
    // Open the window after a brief dramatic pause
    setTimeout(() => openApp("mines"), 400);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useKonamiCode(onKonami);

  const openApp = (id: string) => {
    setStartOpen(false);
    const app = APPS.find(a => a.id === id);
    if (!app) return;
    setWindows(ws => {
      const existing = ws.find(w => w.id === id);
      if (existing) {
        zRef.current += 1;
        return ws.map(w => w.id === id ? { ...w, minimized: false, z: zRef.current } : w);
      }
      zRef.current += 1;
      const offset = ws.length * 24;
      return [...ws, {
        id, title: app.title, icon: app.icon,
        x: 60 + offset, y: 40 + offset,
        width: app.width, height: app.height,
        z: zRef.current, minimized: false, maximized: false,
      }];
    });
    setActiveId(id);
  };

  useEffect(() => {
    if (openedOnce.current) return;
    openedOnce.current = true;
    openApp("browser");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeWin = (id: string) => setWindows(ws => ws.filter(w => w.id !== id));
  const focusWin = (id: string) => {
    zRef.current += 1;
    const z = zRef.current;
    setWindows(ws => ws.map(w => w.id === id ? { ...w, z } : w));
    setActiveId(id);
  };
  const minimizeWin = (id: string) => setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: true } : w));
  const maximizeWin = (id: string) => setWindows(ws => ws.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  const moveWin = (id: string, x: number, y: number) => setWindows(ws => ws.map(w => w.id === id ? { ...w, x, y } : w));

  const toggleTask = (id: string) => {
    const w = windows.find(w => w.id === id);
    if (!w) return;
    if (w.minimized || activeId !== id) {
      setWindows(ws => ws.map(x => x.id === id ? { ...x, minimized: false } : x));
      focusWin(id);
    } else {
      minimizeWin(id);
    }
  };

  return (
    <BSODSystem onRegister={registerCrash}>
    <div className="desktop-bg h-screen w-screen relative overflow-hidden font-pixel" onClick={() => setStartOpen(false)}>
      {/* Desktop icons — visible apps + unlocked Minesweeper */}
      <div className="absolute top-2 left-2 grid grid-cols-1 gap-3 p-2">
        {APPS.filter(a => a.id !== "mines" || minesUnlocked).map(a => (
          <button
            key={a.id}
            onDoubleClick={() => openApp(a.id)}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-0.5 w-16 p-1 text-white text-[11px] focus:bg-titlebar/40 focus:outline-dotted focus:outline-1 focus:outline-white"
            style={{ textShadow: "1px 1px 0 #000" }}
          >
            <div className="text-2xl leading-none">{a.icon}</div>
            <div className="text-center leading-tight break-words">{a.title.split(" — ")[0].split(".")[0]}</div>
          </button>
        ))}
      </div>

      {/* ── Hidden SYSTEM32.exe icon — triggers BSOD ── */}
      <button
        onDoubleClick={(e) => { e.stopPropagation(); crash(); }}
        onClick={(e) => e.stopPropagation()}
        className="absolute flex flex-col items-center gap-0.5 w-16 p-1 text-white text-[11px] focus:bg-titlebar/40 focus:outline-dotted focus:outline-1 focus:outline-white"
        style={{
          bottom: "40px",
          right: "8px",
          textShadow: "1px 1px 0 #000",
          opacity: 0.55,
        }}
        title="⚠ Do not open"
      >
        <div className="text-2xl leading-none">⚙️</div>
        <div className="text-center leading-tight break-words">SYSTEM32</div>
      </button>

      {/* Windows */}
      {windows.map(w => {
        const app = APPS.find(a => a.id === w.id)!;
        return (
          <Window key={w.id} win={w}
            active={activeId === w.id}
            onClose={closeWin} onFocus={focusWin}
            onMinimize={minimizeWin} onMaximize={maximizeWin} onMove={moveWin}>
            {app.render()}
          </Window>
        );
      })}

      {/* Start menu */}
      {startOpen && (
        <div
          className="absolute bottom-[30px] left-0 bevel-out bg-window w-56 z-[9999]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex">
            <div className="bg-titlebar text-titlebar-foreground writing-vertical font-bold px-1 py-2 text-base" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              Webcore<span className="text-[10px]">98</span>
            </div>
            <div className="flex-1 py-1">
              {APPS.map(a => (
                <button key={a.id} onClick={() => openApp(a.id)} className="flex items-center gap-2 w-full px-2 py-1 text-left hover:bg-titlebar hover:text-titlebar-foreground">
                  <span className="text-base">{a.icon}</span>
                  <span>{a.title.split(" — ")[0].split(".")[0]}</span>
                </button>
              ))}
              <div className="border-t border-[color:var(--border-dark)] my-1" />
              <button
                className="flex items-center gap-2 w-full px-2 py-1 text-left hover:bg-titlebar hover:text-titlebar-foreground"
                onClick={() => crash()}
              >
                <span className="text-base">⏻</span><span>Shut Down...</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Konami Code Toast ── */}
      {konamiToast && (
        <div
          className="absolute top-1/2 left-1/2 z-[99999]"
          style={{
            transform: "translate(-50%, -50%)",
            background: "#000080",
            color: "#fff",
            border: "3px outset #c0c0c0",
            padding: "16px 28px",
            textAlign: "center",
            fontFamily: "MS Sans Serif, Tahoma, sans-serif",
            boxShadow: "4px 4px 0 #000",
            minWidth: "260px",
            animation: "konamiPop 0.25s ease-out",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "6px" }}>💣</div>
          <div style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "1px", marginBottom: "4px" }}>
            CHEAT CODE ACTIVATED
          </div>
          <div style={{ fontSize: "11px", color: "#adf", marginBottom: "8px" }}>
            ↑↑↓↓←→←→BA
          </div>
          <div style={{ fontSize: "12px", color: "#ff0" }}>
            Minesweeper unlocked! 🎉
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-[30px] bevel-out bg-taskbar flex items-center px-1 gap-1 z-[1000]">
        <button
          onClick={(e) => { e.stopPropagation(); setStartOpen(o => !o); }}
          className={`win-btn font-bold flex items-center gap-1 h-[24px] ${startOpen ? "win-btn-active" : ""}`}
        >
          <span>🪟</span> Start
        </button>
        <div className="w-px h-[60%] bg-[color:var(--border-dark)] mx-0.5" />
        <div className="flex-1 flex gap-1 overflow-hidden">
          {windows.map(w => (
            <button key={w.id}
              onClick={() => toggleTask(w.id)}
              className={`win-btn flex items-center gap-1 h-[24px] max-w-[160px] truncate ${activeId === w.id && !w.minimized ? "win-btn-active" : ""}`}>
              <span>{w.icon}</span>
              <span className="truncate">{w.title.split(" — ")[0]}</span>
            </button>
          ))}
        </div>
        <div className="bevel-thin-in px-2 h-[22px] flex items-center gap-1 text-[11px]">
          <span>🔊</span><span>{clock}</span>
        </div>
      </div>
    </div>
    </BSODSystem>
  );
}
