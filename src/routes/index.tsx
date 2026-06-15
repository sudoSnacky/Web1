import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Window, type WindowState } from "@/components/desktop/Window";
import { Notepad, Calculator, AboutMe, Paint, Guestbook, Terminal } from "@/components/desktop/apps";
import { NetscapeNavigator } from "@/components/desktop/NetscapeNavigator";
import { Minesweeper } from "@/components/desktop/Minesweeper";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { BSODSystem } from "@/components/desktop/BSODSystem";
import { FileExplorer, type FileItem } from "@/components/desktop/FileExplorer";
import { Winamp } from "@/components/desktop/Winamp";
import { ICQ } from "@/components/desktop/ICQ";

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

const INITIAL_FILES: Record<string, FileItem[]> = {
  "C:": [
    { name: "My Documents", type: "folder" },
    { name: "Program Files", type: "folder" },
    { name: "Windows", type: "folder" }
  ],
  "C:\\My Documents": [
    { name: "Case Studies", type: "folder" },
    { name: "Downloads", type: "folder" },
    { name: "Media", type: "folder" }
  ],
  "C:\\My Documents\\Case Studies": [
    { name: "Webcore98.txt", type: "txt", size: "2.4 KB", content: "CASE STUDY: WEBCORE 98 DESKTOP SYSTEM\n\n- Overview: A high-fidelity retro Windows 98 operating system environment implemented entirely in React and styled with 98.css.\n- Technical Stack: React 18, drag-and-drop window position management, standard layering z-index sorting.\n- UX Elements: Authentic mouse double-click responses, marquee titles, taskbars, live task button switching, and interactive accessories like Calculator and Paint." },
    { name: "Search98.txt", type: "txt", size: "3.1 KB", content: "CASE STUDY: SEARCH98 ENGINE & RETRO SITES\n\n- Overview: An index of replica 1998 websites (Yahoo Finance, WebMuseum Paris, Slashdot, GameFAQs, WebMD, Amazon, MoveOn, Nupedia, BBC, etc.) rendered as internal React layouts.\n- Mechanics: The user submits topics in Search98. The engine performs a search index query matching and returns mock period-accurate results.\n- Dynamic Viewport: Web site results load within the Netscape Navigator window's custom frame, featuring a functioning browser address bar and history navigation." },
    { name: "BSOD_Handler.txt", type: "txt", size: "1.8 KB", content: "CASE STUDY: SYSTEM ERROR CAPTURE SYSTEM (BSOD)\n\n- Overview: A custom crash handler that intercept errors or can be manually invoked via System32 or net errors.\n- Design: Full-screen 4:3 console format rendering high-fidelity white-on-blue text with retro fonts, complete with press-any-key listener loops that trigger soft system reboots back into the workspace." }
  ],
  "C:\\My Documents\\Downloads": [
    { name: "icq_setup.exe", type: "lnk", size: "4.8 MB" },
    { name: "aol_setup.exe", type: "lnk", size: "9.2 MB" }
  ],
  "C:\\My Documents\\Media": [
    { name: "construction.bmp", type: "bmp", size: "64 KB", content: "/under_construction.png" },
    { name: "badges.bmp", type: "bmp", size: "128 KB", content: "/web_badges.png" }
  ],
  "C:\\Program Files": [
    { name: "Games", type: "folder" }
  ],
  "C:\\Program Files\\Games": [
    { name: "clippy.dll", type: "dll", size: "45 KB" },
    { name: "minesweeper.lnk", type: "lnk", size: "1.2 KB" }
  ],
  "C:\\Windows": [
    { name: "System32", type: "folder" }
  ],
  "C:\\Windows\\System32": [
    { name: "kernel32.dll", type: "dll", size: "320 KB" },
    { name: "user32.dll", type: "dll", size: "180 KB" },
    { name: "win.ini", type: "ini", size: "4.1 KB", content: "[windows]\nload=\nrun=\nNullPort=None\ndevice=HP LaserJet\n\n[Desktop]\nWallpaper=none\nPattern=none\n\n[Clippy]\nAdviceEnabled=1\nNostalgiaScale=10" }
  ]
};

function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [konamiToast, setKonamiToast] = useState(false);
  const [minesUnlocked, setMinesUnlocked] = useState(false);

  // Faux File Explorer / Recycle Bin state
  const [fsFiles, setFsFiles] = useState<Record<string, FileItem[]>>(INITIAL_FILES);
  const [explorerPath, setExplorerPath] = useState<string[]>(["C:"]);
  const [recycleBin, setRecycleBin] = useState<FileItem[]>([]);
  
  // Custom dialogs/triggers
  const [viewerImgUrl, setViewerImgUrl] = useState<string | null>(null);
  const [notepadText, setNotepadText] = useState("");
  const [aolDialing, setAolDialing] = useState(false);
  const [aolStatus, setAolStatus] = useState("");
  const [clippyVisible, setClippyVisible] = useState(false);
  const [clippyMessage, setClippyMessage] = useState("");
  const [emptyingProgress, setEmptyingProgress] = useState<number | null>(null);

  const zRef = useRef(10);
  const openedOnce = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerBSOD = useRef<(() => void) | null>(null);
  const registerCrash = useCallback((fn: () => void) => { triggerBSOD.current = fn; }, []);
  const crash = useCallback(() => triggerBSOD.current?.(), []);

  const clippyTips = [
    "It looks like you are trying to view this portfolio. Would you like some help?",
    "Did you know? Double-clicking kernel32.dll in System32 triggers a BSOD!",
    "Tip: You can press the DELETE key to send files directly to the Recycle Bin.",
    "Make sure to sign the Guestbook before you leave!",
    "Try entering the Konami Code (Up Up Down Down...) to unlock Minesweeper!",
    "Winamp is perfect for playing chiptunes in the background."
  ];

  const triggerClippyTip = () => {
    setClippyMessage(clippyTips[Math.floor(Math.random() * clippyTips.length)]);
  };

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setClock(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Konami Code handler
  const onKonami = useCallback(() => {
    setKonamiToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setKonamiToast(false), 2800);
    setMinesUnlocked(true);
    setTimeout(() => openApp("mines"), 400);
  }, []);

  useKonamiCode(onKonami);

  // Sound Synthesizers
  const playTrashSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.25);
      filter.Q.setValueAtTime(5, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  };

  const playEmptyTrashSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      for (let j = 0; j < 3; j++) {
        const delay = j * 0.15;
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(400 - j * 80, now + delay);
        filter.Q.setValueAtTime(4, now + delay);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, now + delay);
        gain.gain.linearRampToValueAtTime(0.01, now + delay + 0.18);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now + delay);
      }
    } catch (e) {}
  };

  const playAolModemSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainDial = ctx.createGain();
      osc1.frequency.setValueAtTime(350, now);
      osc2.frequency.setValueAtTime(440, now);
      gainDial.gain.setValueAtTime(0.04, now);
      gainDial.gain.setValueAtTime(0.04, now + 0.5);
      gainDial.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gainDial);
      osc2.connect(gainDial);
      gainDial.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);

      const dtmfTones = [697, 1209, 770, 1336, 852, 1477];
      dtmfTones.forEach((freq, idx) => {
        const dNow = now + 0.7 + idx * 0.15;
        const dOsc = ctx.createOscillator();
        const dGain = ctx.createGain();
        dOsc.frequency.setValueAtTime(freq, dNow);
        dGain.gain.setValueAtTime(0.04, dNow);
        dGain.gain.exponentialRampToValueAtTime(0.001, dNow + 0.1);
        dOsc.connect(dGain);
        dGain.connect(ctx.destination);
        dOsc.start(dNow);
        dOsc.stop(dNow + 0.12);
      });

      const hNow = now + 1.8;
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, hNow);
      filter.frequency.linearRampToValueAtTime(300, hNow + 0.5);
      filter.frequency.linearRampToValueAtTime(2000, hNow + 1.2);
      filter.Q.setValueAtTime(3, hNow);
      const gainH = ctx.createGain();
      gainH.gain.setValueAtTime(0.06, hNow);
      gainH.gain.exponentialRampToValueAtTime(0.001, hNow + 1.5);
      noise.connect(filter);
      filter.connect(gainH);
      gainH.connect(ctx.destination);
      noise.start(hNow);
    } catch (e) {}
  };

  const handleDeleteFile = (path: string[], file: FileItem) => {
    if (confirm(`Are you sure you want to send '${file.name}' to the Recycle Bin?`)) {
      const pathStr = path.join("\\");
      setFsFiles(prev => ({
        ...prev,
        [pathStr]: prev[pathStr].filter(item => item.name !== file.name)
      }));
      
      const deletedItem: FileItem = {
        ...file,
        originalPath: pathStr,
        dateDeleted: new Date().toLocaleString()
      };
      setRecycleBin(prev => [...prev, deletedItem]);
      playTrashSound();
    }
  };

  const handleEmptyRecycleBin = () => {
    if (confirm("Are you sure you want to permanently delete all items in the Recycle Bin?")) {
      playEmptyTrashSound();
      setEmptyingProgress(0);
      let progressVal = 0;
      const interval = setInterval(() => {
        progressVal += 10;
        setEmptyingProgress(progressVal);
        if (progressVal >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setRecycleBin([]);
            setEmptyingProgress(null);
          }, 200);
        }
      }, 80);
    }
  };

  const handleOpenFile = (file: FileItem) => {
    if (file.type === "txt" || file.type === "ini") {
      setNotepadText(file.content || "");
      openApp("notepad");
    } else if (file.type === "bmp") {
      setViewerImgUrl(file.content || null);
      openApp("imageviewer");
    } else if (file.type === "dll") {
      if (file.name === "kernel32.dll") {
        crash();
      } else if (file.name === "clippy.dll") {
        setClippyVisible(true);
        triggerClippyTip();
      } else {
        alert(`${file.name}: Crucial system DLL. Execution is locked.`);
      }
    } else if (file.type === "lnk") {
      if (file.name === "icq_setup.exe") {
        openApp("icq");
      } else if (file.name === "aol_setup.exe") {
        setAolDialing(true);
        setAolStatus("Dialing 1-800-4-ONLINE...");
        playAolModemSound();
        setTimeout(() => setAolStatus("Verifying username and password..."), 1500);
        setTimeout(() => setAolStatus("Connected at 28.8 Kbps!"), 2800);
        setTimeout(() => {
          setAolDialing(false);
          alert("Welcome to AOL! You've got mail! 📬");
        }, 3400);
      } else if (file.name === "minesweeper.lnk") {
        openApp("mines");
      }
    }
  };

  const APPS: AppDef[] = useMemo(() => [
    { id: "browser", title: "Netscape Navigator", icon: "🌐", width: 660, height: 520, render: () => <NetscapeNavigator /> },
    { id: "about", title: "Welcome.htm — Netscape", icon: "📄", width: 460, height: 420, render: () => <AboutMe /> },
    { id: "notepad", title: "Untitled — Notepad", icon: "📝", width: 420, height: 320, render: () => <Notepad text={notepadText} onChange={setNotepadText} /> },
    { id: "calc", title: "Calculator", icon: "🧮", width: 220, height: 280, render: () => <Calculator /> },
    { id: "paint", title: "untitled — Paint", icon: "🎨", width: 520, height: 440, render: () => <Paint /> },
    { id: "guestbook", title: "Guestbook.exe", icon: "📖", width: 380, height: 420, render: () => <Guestbook /> },
    { id: "terminal", title: "MS-DOS Prompt", icon: "💻", width: 460, height: 320, render: () => <Terminal /> },
    { id: "mines", title: "Minesweeper", icon: "💣", width: 360, height: 430, render: () => <Minesweeper /> },
    {
      id: "explorer",
      title: "My Computer",
      icon: "📁",
      width: 520,
      height: 380,
      render: () => (
        <FileExplorer
          currentPath={explorerPath}
          onNavigate={setExplorerPath}
          files={fsFiles}
          onDeleteFile={handleDeleteFile}
          onOpenFile={handleOpenFile}
        />
      )
    },
    {
      id: "winamp",
      title: "Winamp 2.81",
      icon: "📻",
      width: 290,
      height: 380,
      render: () => <Winamp />
    },
    {
      id: "icq",
      title: "ICQ - 99187315",
      icon: "🌸",
      width: 440,
      height: 400,
      render: () => <ICQ />
    },
    {
      id: "imageviewer",
      title: "Image Preview",
      icon: "🎨",
      width: 380,
      height: 340,
      render: () => (
        <div className="flex flex-col items-center justify-center p-4 bg-window h-full">
          {viewerImgUrl ? (
            <img src={viewerImgUrl} alt="Preview" className="max-w-full max-h-full bevel-thin-in bg-white" style={{ imageRendering: "pixelated" }} />
          ) : (
            <span className="text-gray-500">No Image Loaded</span>
          )}
        </div>
      )
    },
    {
      id: "recycle",
      title: "Recycle Bin",
      icon: recycleBin.length > 0 ? "🗑️📄" : "🗑️",
      width: 480,
      height: 340,
      render: () => (
        <div className="flex flex-col h-full bg-window text-[11px] font-sans">
          <div className="flex items-center gap-2 p-1 border-b border-[color:var(--border-dark)] select-none">
            <button onClick={handleEmptyRecycleBin} disabled={recycleBin.length === 0} className="win-btn px-2 py-0.5 font-bold">
              Empty Recycle Bin
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-white p-1 select-none">
            {recycleBin.length === 0 ? (
              <div className="text-gray-400 text-center py-12">Recycle Bin is empty.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-400 font-bold text-gray-700">
                    <th className="p-1 border-r border-gray-300">Name</th>
                    <th className="p-1 border-r border-gray-300">Original Path</th>
                    <th className="p-1 border-r border-gray-300">Date Deleted</th>
                    <th className="p-1">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {recycleBin.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-100 border-b border-gray-200">
                      <td className="p-1 flex items-center gap-1">
                        <span>{item.type === "folder" ? "📁" : "📄"}</span>
                        <span>{item.name}</span>
                      </td>
                      <td className="p-1 text-gray-600">{item.originalPath}</td>
                      <td className="p-1 text-gray-500 text-[10px]">{item.dateDeleted}</td>
                      <td className="p-1 text-gray-600">{item.size || "1 KB"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )
    }
  ], [explorerPath, fsFiles, recycleBin, viewerImgUrl, notepadText]);

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
  }, []);

  const closeWin = (id: string) => {
    // Enhancement: Closing a window puts a shortcut entry in the Recycle Bin!
    const closedApp = APPS.find(a => a.id === id);
    if (closedApp && id !== "recycle") {
      const shortcutItem: FileItem = {
        name: `${closedApp.title.split(" — ")[0]}.lnk`,
        type: "lnk",
        size: "1.0 KB",
        originalPath: "Desktop",
        dateDeleted: new Date().toLocaleString()
      };
      setRecycleBin(prev => {
        // Prevent duplicate shortcut inserts
        if (prev.some(item => item.name === shortcutItem.name)) return prev;
        return [...prev, shortcutItem];
      });
    }
    setWindows(ws => ws.filter(w => w.id !== id));
  };

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

  const desktopIcons = [
    { id: "explorer", title: "My Computer", icon: "📁" },
    { id: "browser", title: "Netscape Navigator", icon: "🌐" },
    { id: "winamp", title: "Winamp", icon: "📻" },
    { id: "icq", title: "ICQ Client", icon: "🌸" },
    { id: "recycle", title: "Recycle Bin", icon: recycleBin.length > 0 ? "🗑️📄" : "🗑️" }
  ];

  return (
    <BSODSystem onRegister={registerCrash}>
    <div className="desktop-bg h-screen w-screen relative overflow-hidden font-pixel" onClick={() => setStartOpen(false)}>
      {/* Desktop icons */}
      <div className="absolute top-2 left-2 grid grid-cols-1 gap-3 p-2">
        {desktopIcons.map(iconDef => (
          <button
            key={iconDef.id}
            onDoubleClick={() => openApp(iconDef.id)}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-0.5 w-16 p-1 text-white text-[11px] focus:bg-titlebar/40 focus:outline-dotted focus:outline-1 focus:outline-white"
            style={{ textShadow: "1px 1px 0 #000" }}
          >
            <div className="text-2xl leading-none">{iconDef.icon}</div>
            <div className="text-center leading-tight break-words">{iconDef.title}</div>
          </button>
        ))}

        {/* Locked Minesweeper Icon */}
        {minesUnlocked && (
          <button
            onDoubleClick={() => openApp("mines")}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-0.5 w-16 p-1 text-white text-[11px] focus:bg-titlebar/40 focus:outline-dotted focus:outline-1 focus:outline-white"
            style={{ textShadow: "1px 1px 0 #000" }}
          >
            <div className="text-2xl leading-none">💣</div>
            <div className="text-center leading-tight break-words">Minesweeper</div>
          </button>
        )}
      </div>

      {/* Hidden SYSTEM32.exe icon — triggers BSOD */}
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

      {/* Clippy Floating Buddy */}
      {clippyVisible && (
        <div className="absolute bottom-12 right-4 z-[99999] flex flex-col items-end gap-1 select-none">
          <div className="bevel-out bg-[#ffffe1] text-black border border-black p-2 rounded shadow-md max-w-xs relative text-xs">
            <div className="absolute right-3 -bottom-2 w-0 h-0 border-t-8 border-t-[#ffffe1] border-r-8 border-r-transparent border-l-8 border-l-transparent"></div>
            {clippyMessage}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={triggerClippyTip} className="win-btn !p-1 text-[10px]">Ask Clippy</button>
            <button onClick={() => setClippyVisible(false)} className="win-btn !p-1 text-[10px]">Dismiss</button>
            <div className="text-4xl">📎</div>
          </div>
        </div>
      )}

      {/* Emptying Bin Progress Modal */}
      {emptyingProgress !== null && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-[999999] select-none">
          <div className="window w-64 shadow-lg">
            <div className="title-bar">
              <div className="title-bar-text">Emptying Recycle Bin</div>
            </div>
            <div className="window-body text-center p-3">
              <div className="text-2xl mb-2 animate-bounce">📄🗑️</div>
              <div className="mb-2 text-xs">Deleting items permanently...</div>
              <div className="progress-bar">
                <div className="progress-bar-value" style={{ width: `${emptyingProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AOL Dial-up Connecting Screen */}
      {aolDialing && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[999999] select-none">
          <div className="window w-72 shadow-lg">
            <div className="title-bar">
              <div className="title-bar-text">AOL Dialer</div>
            </div>
            <div className="window-body p-4 flex flex-col gap-2">
              <div className="text-center font-bold text-[#000080] text-sm">America Online</div>
              <div className="text-[11px] text-gray-700 bg-white p-2 border bevel-thin-in font-mono min-h-12">
                {aolStatus}
              </div>
              <div className="progress-bar">
                <div className="progress-bar-value animate-[pulse_1.5s_infinite]"></div>
              </div>
              <button onClick={() => setAolDialing(false)} className="win-btn mt-2 align-self-end w-20 mx-auto">Cancel</button>
            </div>
          </div>
        </div>
      )}

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
              {desktopIcons.map(a => (
                <button key={a.id} onClick={() => openApp(a.id)} className="flex items-center gap-2 w-full px-2 py-1 text-left hover:bg-titlebar hover:text-titlebar-foreground">
                  <span className="text-base">{a.icon}</span>
                  <span>{a.title}</span>
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

      {/* Konami Code Toast */}
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
