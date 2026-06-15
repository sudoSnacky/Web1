import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Window, type WindowState } from "@/components/desktop/Window";
import { Notepad, Calculator, AboutMe, Paint, Guestbook, Terminal } from "@/components/desktop/apps";

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

const APPS: AppDef[] = [
  { id: "about", title: "Welcome.htm — Netscape", icon: "🌐", width: 460, height: 420, render: () => <AboutMe /> },
  { id: "notepad", title: "Untitled — Notepad", icon: "📝", width: 420, height: 320, render: () => <Notepad /> },
  { id: "calc", title: "Calculator", icon: "🧮", width: 220, height: 280, render: () => <Calculator /> },
  { id: "paint", title: "untitled — Paint", icon: "🎨", width: 520, height: 440, render: () => <Paint /> },
  { id: "guestbook", title: "Guestbook.exe", icon: "📖", width: 380, height: 420, render: () => <Guestbook /> },
  { id: "terminal", title: "MS-DOS Prompt", icon: "💻", width: 460, height: 320, render: () => <Terminal /> },
];

function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");
  const zRef = useRef(10);
  const openedOnce = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setClock(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

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
    openApp("about");
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
    <div className="desktop-bg h-screen w-screen relative overflow-hidden font-pixel" onClick={() => setStartOpen(false)}>
      {/* Desktop icons */}
      <div className="absolute top-2 left-2 grid grid-cols-1 gap-3 p-2">
        {APPS.map(a => (
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
              <button className="flex items-center gap-2 w-full px-2 py-1 text-left hover:bg-titlebar hover:text-titlebar-foreground" onClick={() => alert("It is now safe to turn off your computer.")}>
                <span className="text-base">⏻</span><span>Shut Down...</span>
              </button>
            </div>
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
  );
}
