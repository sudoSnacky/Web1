import { useState, useRef, useEffect } from "react";

export function Notepad({ text: externalText, onChange }: { text?: string; onChange?: (val: string) => void }) {
  const [internalText, setInternalText] = useState("Welcome to Notepad.exe\r\n\r\nType anything here...\r\n\r\nThe internet was a different place in 1998.\r\n");
  const isControlled = externalText !== undefined;
  const text = isControlled ? externalText : internalText;
  const setText = isControlled && onChange ? onChange : setInternalText;

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 px-1 py-0.5 border-b border-[color:var(--border-dark)] text-xs select-none">
        <span className="hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default">File</span>
        <span className="hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default">Edit</span>
        <span className="hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default">Search</span>
        <span className="hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default">Help</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full p-1 bevel-thin-in bg-white text-black font-pixel text-[13px] resize-none outline-none"
        style={{ fontFamily: "Lucida Console, Courier New, monospace" }}
      />
    </div>
  );
}

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const inputDigit = (d: string) => {
    if (reset || display === "0") {
      setDisplay(d);
      setReset(false);
    } else {
      setDisplay(display + d);
    }
  };
  const setOperation = (newOp: string) => {
    if (prev !== null && op && !reset) compute();
    else setPrev(parseFloat(display));
    setOp(newOp);
    setReset(true);
  };
  const compute = () => {
    if (prev === null || op === null) return;
    const cur = parseFloat(display);
    let r = 0;
    switch (op) {
      case "+": r = prev + cur; break;
      case "-": r = prev - cur; break;
      case "*": r = prev * cur; break;
      case "/": r = cur === 0 ? NaN : prev / cur; break;
    }
    setDisplay(String(r));
    setPrev(r);
    setReset(true);
  };
  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setReset(false); };

  const Btn = ({ label, onClick, wide }: { label: string; onClick: () => void; wide?: boolean }) => (
    <button onClick={onClick} className={`win-btn font-bold ${wide ? "col-span-2" : ""}`}>{label}</button>
  );

  return (
    <div className="p-2 flex flex-col gap-2 h-full">
      <div className="bevel-thin-in bg-white text-right p-1 font-mono text-lg overflow-hidden">{display}</div>
      <div className="grid grid-cols-4 gap-1 flex-1">
        <Btn label="C" onClick={clear} wide />
        <Btn label="/" onClick={() => setOperation("/")} />
        <Btn label="*" onClick={() => setOperation("*")} />
        {["7","8","9"].map(d => <Btn key={d} label={d} onClick={() => inputDigit(d)} />)}
        <Btn label="-" onClick={() => setOperation("-")} />
        {["4","5","6"].map(d => <Btn key={d} label={d} onClick={() => inputDigit(d)} />)}
        <Btn label="+" onClick={() => setOperation("+")} />
        {["1","2","3"].map(d => <Btn key={d} label={d} onClick={() => inputDigit(d)} />)}
        <Btn label="=" onClick={compute} />
        <Btn label="0" onClick={() => inputDigit("0")} wide />
        <Btn label="." onClick={() => { if(!display.includes(".")) setDisplay(display + "."); }} />
      </div>
    </div>
  );
}

export function AboutMe() {
  return (
    <div className="p-3 overflow-auto h-full text-[13px] leading-relaxed">
      <div className="text-center mb-3">
        <div className="text-2xl">🌐</div>
        <h1 className="font-bold text-base" style={{ fontFamily: "Times New Roman, serif" }}>Welcome to my HoMePaGe!!</h1>
        <p className="text-[11px]">★ Best viewed in Netscape Navigator 4.0 ★</p>
      </div>
      <div className="bg-black text-[#00ff00] py-1 mb-3 font-mono overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[marquee_15s_linear_infinite]">▓▒░ U R visitor #000420 ░▒▓ thanks 4 stopping by!!! ▓▒░ &nbsp; ▓▒░ U R visitor #000420 ░▒▓ thanks 4 stopping by!!! ▓▒░</div>
      </div>
      <p className="mb-2">Hi!! Welcome 2 my little corner of the World Wide Web!! This site is under <span className="text-red-600 font-bold blink">CONSTRUCTION</span> 🚧</p>
      <p className="mb-2">Here u will find tools, games and other cool stuff. Sign my guestbook before u leave!! 📖</p>
      <ul className="list-disc pl-5 mb-2">
        <li>📝 Notepad — write things down</li>
        <li>🧮 Calculator — do the maths</li>
        <li>🎨 Paint — make pixel art</li>
        <li>📖 Guestbook — say hi</li>
        <li>💻 Terminal — hack the planet</li>
      </ul>
      <div className="text-center mt-4 text-[11px] text-gray-700">
        © 1998 — last updated 11/04/99
      </div>
    </div>
  );
}

type PaintTool = "pencil" | "brush" | "eraser" | "fill" | "line" | "rect" | "ellipse" | "picker";

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const W = 320, H = 220;
  const [tool, setTool] = useState<PaintTool>("pencil");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(2);
  const [coords, setCoords] = useState("0, 0");
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  const palette = ["#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080",
                   "#ffffff","#c0c0c0","#ff0000","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"];
  const tools: { id: PaintTool; label: string; icon: string }[] = [
    { id: "pencil", label: "Pencil", icon: "✏" },
    { id: "brush", label: "Brush", icon: "🖌" },
    { id: "eraser", label: "Eraser", icon: "🧽" },
    { id: "fill", label: "Fill", icon: "🪣" },
    { id: "picker", label: "Picker", icon: "💧" },
    { id: "line", label: "Line", icon: "／" },
    { id: "rect", label: "Rect", icon: "▭" },
    { id: "ellipse", label: "Oval", icon: "◯" },
  ];

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;
  const getPreviewCtx = () => previewRef.current?.getContext("2d") ?? null;

  // init canvas
  useEffect(() => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    pushHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushHistory = () => {
    const ctx = getCtx();
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, W, H);
    historyRef.current.push(snap);
    if (historyRef.current.length > 30) historyRef.current.shift();
  };

  const undo = () => {
    if (historyRef.current.length <= 1) return;
    historyRef.current.pop();
    const prev = historyRef.current[historyRef.current.length - 1];
    getCtx()?.putImageData(prev, 0, 0);
  };

  const clear = () => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);
    pushHistory();
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - r.left) * (W / r.width)),
      y: Math.round((e.clientY - r.top) * (H / r.height)),
    };
  };

  const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number, col: string, sz: number) => {
    ctx.fillStyle = col;
    if (tool === "pencil") {
      ctx.fillRect(x, y, sz, sz);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, sz, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const strokeLine = (ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, col: string, sz: number) => {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy, x = x0, y = y0;
    while (true) {
      drawDot(ctx, x, y, col, sz);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx) { err += dx; y += sy; }
    }
  };

  const floodFill = (sx: number, sy: number, fill: string) => {
    const ctx = getCtx();
    if (!ctx) return;
    const img = ctx.getImageData(0, 0, W, H);
    const data = img.data;
    const idx = (x: number, y: number) => (y * W + x) * 4;
    const start = idx(sx, sy);
    const tr = data[start], tg = data[start+1], tb = data[start+2], ta = data[start+3];
    const m = fill.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return;
    const fr = parseInt(m[1],16), fg = parseInt(m[2],16), fb = parseInt(m[3],16);
    if (tr===fr && tg===fg && tb===fb && ta===255) return;
    const stack: [number, number][] = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      if (x<0||y<0||x>=W||y>=H) continue;
      const i = idx(x, y);
      if (data[i]!==tr||data[i+1]!==tg||data[i+2]!==tb||data[i+3]!==ta) continue;
      data[i]=fr; data[i+1]=fg; data[i+2]=fb; data[i+3]=255;
      stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
    }
    ctx.putImageData(img, 0, 0);
  };

  const onDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx) return;
    const p = getPos(e);
    const col = e.button === 2 ? bgColor : color;
    const useCol = tool === "eraser" ? bgColor : col;

    if (tool === "picker") {
      const d = ctx.getImageData(p.x, p.y, 1, 1).data;
      const hex = "#" + [d[0],d[1],d[2]].map(v => v.toString(16).padStart(2,"0")).join("");
      if (e.button === 2) setBgColor(hex); else setColor(hex);
      return;
    }
    if (tool === "fill") {
      floodFill(p.x, p.y, useCol);
      pushHistory();
      return;
    }
    drawingRef.current = true;
    startRef.current = p;
    lastRef.current = p;
    if (tool === "line" || tool === "rect" || tool === "ellipse") {
      snapshotRef.current = ctx.getImageData(0, 0, W, H);
    } else {
      drawDot(ctx, p.x, p.y, useCol, tool === "pencil" ? size : size + 1);
    }
  };

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = getPos(e);
    setCoords(`${p.x}, ${p.y}`);
    if (!drawingRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const useCol = tool === "eraser" ? bgColor : color;
    const sz = tool === "pencil" ? size : size + 1;

    if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      const last = lastRef.current ?? p;
      strokeLine(ctx, last.x, last.y, p.x, p.y, useCol, sz);
      lastRef.current = p;
    } else if (snapshotRef.current && startRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.strokeStyle = useCol;
      ctx.fillStyle = useCol;
      ctx.lineWidth = Math.max(1, size);
      const s = startRef.current;
      if (tool === "line") {
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      } else if (tool === "rect") {
        ctx.strokeRect(Math.min(s.x,p.x), Math.min(s.y,p.y), Math.abs(p.x-s.x), Math.abs(p.y-s.y));
      } else if (tool === "ellipse") {
        ctx.beginPath();
        ctx.ellipse((s.x+p.x)/2, (s.y+p.y)/2, Math.abs(p.x-s.x)/2, Math.abs(p.y-s.y)/2, 0, 0, Math.PI*2);
        ctx.stroke();
      }
    }
  };

  const onUp = () => {
    if (drawingRef.current) pushHistory();
    drawingRef.current = false;
    lastRef.current = null;
    startRef.current = null;
    snapshotRef.current = null;
  };

  const save = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url; a.download = "untitled.png"; a.click();
  };

  return (
    <div className="flex flex-col h-full bg-window text-[11px]">
      {/* Menu bar */}
      <div className="flex gap-2 px-1 py-0.5 border-b border-[color:var(--border-dark)] select-none">
        <span className="hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default" onClick={save}>File</span>
        <span className="hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default" onClick={undo}>Edit</span>
        <span className="hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default" onClick={clear}>Image</span>
        <span className="hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default">Help</span>
      </div>

      <div className="flex flex-1 overflow-hidden gap-1 p-1">
        {/* Tool palette */}
        <div className="bevel-out p-0.5 grid grid-cols-2 gap-0.5 h-fit">
          {tools.map(t => (
            <button key={t.id} title={t.label} onClick={() => setTool(t.id)}
              className={`w-6 h-6 flex items-center justify-center text-[13px] win-btn !px-0 !py-0 ${tool === t.id ? "win-btn-active" : ""}`}>
              {t.icon}
            </button>
          ))}
        </div>

        <div className="flex flex-col flex-1 gap-1 overflow-hidden">
          {/* Size selector */}
          <div className="bevel-thin-in bg-white p-1 flex items-center gap-1">
            <span className="text-[10px]">Size:</span>
            {[1,2,4,8].map(s => (
              <button key={s} onClick={() => setSize(s)}
                className={`w-6 h-5 flex items-center justify-center ${size===s ? "bevel-thin-in bg-[color:var(--muted)]" : "bevel-thin"}`}>
                <div style={{ background: "#000", width: s*1.5, height: s*1.5, borderRadius: tool==='pencil'?0:'50%' }} />
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div className="flex-1 bevel-thin-in bg-[color:var(--muted)] overflow-auto p-1">
            <canvas
              ref={canvasRef}
              width={W} height={H}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onContextMenu={(e) => e.preventDefault()}
              className="bg-white cursor-crosshair"
              style={{ imageRendering: "pixelated", width: W, height: H, display: "block" }}
            />
            <canvas ref={previewRef} width={W} height={H} className="hidden" />
          </div>
        </div>
      </div>

      {/* Color palette + status */}
      <div className="border-t border-[color:var(--border-dark)] p-1 flex items-center gap-2">
        <div className="bevel-thin-in flex flex-col p-0.5 bg-window">
          <div className="relative w-8 h-8">
            <div className="absolute top-0 left-0 w-5 h-5 border border-black" style={{ background: color }} />
            <div className="absolute bottom-0 right-0 w-5 h-5 border border-black" style={{ background: bgColor }} />
          </div>
        </div>
        <div className="bevel-thin-in bg-window p-0.5 grid grid-rows-2 grid-flow-col gap-0.5">
          {palette.map(c => (
            <button key={c}
              onClick={() => setColor(c)}
              onContextMenu={(e) => { e.preventDefault(); setBgColor(c); }}
              className="w-4 h-4 border border-black"
              style={{ background: c }}
              title={`${c} (right-click for bg)`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          <button className="win-btn !py-0 !px-2 text-[10px]" onClick={undo}>Undo</button>
          <button className="win-btn !py-0 !px-2 text-[10px]" onClick={clear}>Clear</button>
        </div>
        <div className="ml-auto bevel-thin-in px-2 py-0.5 text-[10px] font-mono">{coords}</div>
      </div>
    </div>
  );
}

interface GuestEntry { name: string; msg: string; time: string; }
export function Guestbook() {
  const [entries, setEntries] = useState<GuestEntry[]>([
    { name: "xXcoolKid99Xx", msg: "first!! sick site dude 🤘", time: "12/03/99" },
    { name: "webmistress_98", msg: "love the layout! linking u from my page", time: "10/17/99" },
    { name: "DialUpDan", msg: "took 4 minutes to load but worth it", time: "09/22/99" },
  ]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const submit = () => {
    if (!name.trim() || !msg.trim()) return;
    setEntries([{ name, msg, time: new Date().toLocaleDateString() }, ...entries]);
    setName(""); setMsg("");
  };

  return (
    <div className="p-2 h-full flex flex-col gap-2 overflow-hidden">
      <div className="bevel-thin-in bg-white p-2">
        <div className="font-bold mb-1">✍ Sign the Guestbook</div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your handle" className="bevel-thin-in px-1 py-0.5 w-full mb-1 outline-none" />
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Leave a message..." className="bevel-thin-in px-1 py-0.5 w-full h-16 outline-none resize-none" />
        <button className="win-btn mt-1" onClick={submit}>Submit</button>
      </div>
      <div className="flex-1 overflow-auto bevel-thin-in bg-white p-2 space-y-2">
        {entries.map((e, i) => (
          <div key={i} className="border-b border-dashed border-gray-400 pb-1">
            <div className="font-bold text-[color:var(--titlebar)]">{e.name} <span className="text-[10px] text-gray-600 font-normal">— {e.time}</span></div>
            <div className="text-[12px]">{e.msg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Terminal() {
  const [lines, setLines] = useState<string[]>([
    "WebOS [Version 1.0.95]",
    "(C) Copyright 1995-1999 Webcore Industries.",
    "",
    "Type 'help' for available commands.",
    "",
  ]);
  const [input, setInput] = useState("");

  const run = (cmd: string) => {
    const out: string[] = [`C:\\> ${cmd}`];
    const c = cmd.trim().toLowerCase();
    if (c === "help") out.push("Commands: help, about, dir, date, hack, ena, cls, exit");
    else if (c === "about") out.push("Webcore OS — an internet aesthetic experience.");
    else if (c === "dir") out.push(" notepad.exe", " calc.exe", " paint.exe", " guestbook.htm", " secret.txt");
    else if (c === "date") out.push(new Date().toString());
    else if (c === "hack") out.push("ACCESSING MAINFRAME...", "BYPASSING FIREWALL...", "DOWNLOADING INTERNET...", "DONE. You hacked the planet. 🌍");
    else if (c === "ena") out.push("ENA found. low-poly memories loaded.");
    else if (c === "cls") { setLines([]); setInput(""); return; }
    else if (c === "exit") out.push("Cannot exit. There is no escape.");
    else if (c === "") {}
    else out.push(`'${cmd}' is not recognized as an internal or external command.`);
    setLines(l => [...l, ...out, ""]);
    setInput("");
  };

  return (
    <div className="bg-black text-[#00ff00] font-mono text-[12px] h-full p-2 overflow-auto" style={{ fontFamily: "Lucida Console, monospace" }}
      onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}>
      {lines.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l || "\u00a0"}</div>)}
      <div className="flex">
        <span>C:\&gt;&nbsp;</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") run(input); }}
          className="flex-1 bg-transparent outline-none text-[#00ff00]"
          autoFocus
        />
      </div>
    </div>
  );
}
