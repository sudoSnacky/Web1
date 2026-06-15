import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function Window({ win, onClose, onFocus, onMinimize, onMaximize, onMove, active, children }) {
  const draggingRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function onUp() {
      draggingRef.current = null;
    }
    function onMouseMove(e) {
      if (!draggingRef.current) return;
      onMove(win.id, e.clientX - draggingRef.current.ox, e.clientY - draggingRef.current.oy);
    }
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [win.id, onMove]);
  if (win.minimized) return null;
  const style = win.maximized ? { left: 0, top: 0, width: "100%", height: "calc(100% - 30px)", zIndex: win.z } : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "absolute bevel-out bg-window flex flex-col",
      style,
      onMouseDown: () => onFocus(win.id),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center justify-between px-1 py-0.5 select-none ${active ? "bg-titlebar text-titlebar-foreground" : "bg-[color:var(--titlebar-inactive)] text-titlebar-foreground"}`,
            onMouseDown: (e) => {
              if (win.maximized) return;
              const rect = e.currentTarget.parentElement.getBoundingClientRect();
              draggingRef.current = { ox: e.clientX - rect.left, oy: e.clientY - rect.top };
              onFocus(win.id);
            },
            onDoubleClick: () => onMaximize(win.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: win.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: win.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "win-btn !px-1 !py-0 font-bold leading-none h-[18px] w-[20px]", onClick: () => onMinimize(win.id), children: "_" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "win-btn !px-1 !py-0 font-bold leading-none h-[18px] w-[20px]", onClick: () => onMaximize(win.id), children: "□" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "win-btn !px-1 !py-0 font-bold leading-none h-[18px] w-[20px]", onClick: () => onClose(win.id), children: "×" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden bevel-thin-in bg-window m-0.5", children })
      ]
    }
  );
}
function Notepad({ text: externalText, onChange }) {
  const [internalText, setInternalText] = reactExports.useState("Welcome to Notepad.exe\r\n\r\nType anything here...\r\n\r\nThe internet was a different place in 1998.\r\n");
  const isControlled = externalText !== void 0;
  const text = isControlled ? externalText : internalText;
  const setText = isControlled && onChange ? onChange : setInternalText;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 px-1 py-0.5 border-b border-[color:var(--border-dark)] text-xs select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default", children: "File" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default", children: "Edit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default", children: "Search" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default", children: "Help" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        value: text,
        onChange: (e) => setText(e.target.value),
        spellCheck: false,
        className: "flex-1 w-full p-1 bevel-thin-in bg-white text-black font-pixel text-[13px] resize-none outline-none",
        style: { fontFamily: "Lucida Console, Courier New, monospace" }
      }
    )
  ] });
}
function Calculator() {
  const [display, setDisplay] = reactExports.useState("0");
  const [prev, setPrev] = reactExports.useState(null);
  const [op, setOp] = reactExports.useState(null);
  const [reset, setReset] = reactExports.useState(false);
  const inputDigit = (d) => {
    if (reset || display === "0") {
      setDisplay(d);
      setReset(false);
    } else {
      setDisplay(display + d);
    }
  };
  const setOperation = (newOp) => {
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
      case "+":
        r = prev + cur;
        break;
      case "-":
        r = prev - cur;
        break;
      case "*":
        r = prev * cur;
        break;
      case "/":
        r = cur === 0 ? NaN : prev / cur;
        break;
    }
    setDisplay(String(r));
    setPrev(r);
    setReset(true);
  };
  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setReset(false);
  };
  const Btn = ({ label, onClick, wide }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: `win-btn font-bold ${wide ? "col-span-2" : ""}`, children: label });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 flex flex-col gap-2 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bevel-thin-in bg-white text-right p-1 font-mono text-lg overflow-hidden", children: display }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-1 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: "C", onClick: clear, wide: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: "/", onClick: () => setOperation("/") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: "*", onClick: () => setOperation("*") }),
      ["7", "8", "9"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: d, onClick: () => inputDigit(d) }, d)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: "-", onClick: () => setOperation("-") }),
      ["4", "5", "6"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: d, onClick: () => inputDigit(d) }, d)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: "+", onClick: () => setOperation("+") }),
      ["1", "2", "3"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: d, onClick: () => inputDigit(d) }, d)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: "=", onClick: compute }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: "0", onClick: () => inputDigit("0"), wide: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { label: ".", onClick: () => {
        if (!display.includes(".")) setDisplay(display + ".");
      } })
    ] })
  ] });
}
function AboutMe() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 overflow-auto h-full text-[13px] leading-relaxed", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: "🌐" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base", style: { fontFamily: "Times New Roman, serif" }, children: "Welcome to my HoMePaGe!!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", children: "★ Best viewed in Netscape Navigator 4.0 ★" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black text-[#00ff00] py-1 mb-3 font-mono overflow-hidden whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block animate-[marquee_15s_linear_infinite]", children: "▓▒░ U R visitor #000420 ░▒▓ thanks 4 stopping by!!! ▓▒░   ▓▒░ U R visitor #000420 ░▒▓ thanks 4 stopping by!!! ▓▒░" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2", children: [
      "Hi!! Welcome 2 my little corner of the World Wide Web!! This site is under ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-bold blink", children: "CONSTRUCTION" }),
      " 🚧"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2", children: "Here u will find tools, games and other cool stuff. Sign my guestbook before u leave!! 📖" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "📝 Notepad — write things down" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "🧮 Calculator — do the maths" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "🎨 Paint — make pixel art" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "📖 Guestbook — say hi" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "💻 Terminal — hack the planet" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-4 text-[11px] text-gray-700", children: "© 1998 — last updated 11/04/99" })
  ] });
}
function Paint() {
  const canvasRef = reactExports.useRef(null);
  const previewRef = reactExports.useRef(null);
  const W = 320, H = 220;
  const [tool, setTool] = reactExports.useState("pencil");
  const [color, setColor] = reactExports.useState("#000000");
  const [bgColor, setBgColor] = reactExports.useState("#ffffff");
  const [size, setSize] = reactExports.useState(2);
  const [coords, setCoords] = reactExports.useState("0, 0");
  const drawingRef = reactExports.useRef(false);
  const lastRef = reactExports.useRef(null);
  const startRef = reactExports.useRef(null);
  const snapshotRef = reactExports.useRef(null);
  const historyRef = reactExports.useRef([]);
  const palette = [
    "#000000",
    "#808080",
    "#800000",
    "#808000",
    "#008000",
    "#008080",
    "#000080",
    "#800080",
    "#ffffff",
    "#c0c0c0",
    "#ff0000",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#ff00ff"
  ];
  const tools = [
    { id: "pencil", label: "Pencil", icon: "✏" },
    { id: "brush", label: "Brush", icon: "🖌" },
    { id: "eraser", label: "Eraser", icon: "🧽" },
    { id: "fill", label: "Fill", icon: "🪣" },
    { id: "picker", label: "Picker", icon: "💧" },
    { id: "line", label: "Line", icon: "／" },
    { id: "rect", label: "Rect", icon: "▭" },
    { id: "ellipse", label: "Oval", icon: "◯" }
  ];
  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;
  reactExports.useEffect(() => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    pushHistory();
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
  const getPos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - r.left) * (W / r.width)),
      y: Math.round((e.clientY - r.top) * (H / r.height))
    };
  };
  const drawDot = (ctx, x, y, col, sz) => {
    ctx.fillStyle = col;
    if (tool === "pencil") {
      ctx.fillRect(x, y, sz, sz);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, sz, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  const strokeLine = (ctx, x0, y0, x1, y1, col, sz) => {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy, x = x0, y = y0;
    while (true) {
      drawDot(ctx, x, y, col, sz);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  };
  const floodFill = (sx, sy, fill) => {
    const ctx = getCtx();
    if (!ctx) return;
    const img = ctx.getImageData(0, 0, W, H);
    const data = img.data;
    const idx = (x, y) => (y * W + x) * 4;
    const start = idx(sx, sy);
    const tr = data[start], tg = data[start + 1], tb = data[start + 2], ta = data[start + 3];
    const m = fill.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return;
    const fr = parseInt(m[1], 16), fg = parseInt(m[2], 16), fb = parseInt(m[3], 16);
    if (tr === fr && tg === fg && tb === fb && ta === 255) return;
    const stack = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = idx(x, y);
      if (data[i] !== tr || data[i + 1] !== tg || data[i + 2] !== tb || data[i + 3] !== ta) continue;
      data[i] = fr;
      data[i + 1] = fg;
      data[i + 2] = fb;
      data[i + 3] = 255;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(img, 0, 0);
  };
  const onDown = (e) => {
    const ctx = getCtx();
    if (!ctx) return;
    const p = getPos(e);
    const col = e.button === 2 ? bgColor : color;
    const useCol = tool === "eraser" ? bgColor : col;
    if (tool === "picker") {
      const d = ctx.getImageData(p.x, p.y, 1, 1).data;
      const hex = "#" + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
      if (e.button === 2) setBgColor(hex);
      else setColor(hex);
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
  const onMove = (e) => {
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
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      } else if (tool === "rect") {
        ctx.strokeRect(Math.min(s.x, p.x), Math.min(s.y, p.y), Math.abs(p.x - s.x), Math.abs(p.y - s.y));
      } else if (tool === "ellipse") {
        ctx.beginPath();
        ctx.ellipse((s.x + p.x) / 2, (s.y + p.y) / 2, Math.abs(p.x - s.x) / 2, Math.abs(p.y - s.y) / 2, 0, 0, Math.PI * 2);
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
    a.href = url;
    a.download = "untitled.png";
    a.click();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-window text-[11px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 px-1 py-0.5 border-b border-[color:var(--border-dark)] select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default", onClick: save, children: "File" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default", onClick: undo, children: "Edit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default", onClick: clear, children: "Image" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:bg-titlebar hover:text-titlebar-foreground px-1 cursor-default", children: "Help" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden gap-1 p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bevel-out p-0.5 grid grid-cols-2 gap-0.5 h-fit", children: tools.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          title: t.label,
          onClick: () => setTool(t.id),
          className: `w-6 h-6 flex items-center justify-center text-[13px] win-btn !px-0 !py-0 ${tool === t.id ? "win-btn-active" : ""}`,
          children: t.icon
        },
        t.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 gap-1 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bevel-thin-in bg-white p-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Size:" }),
          [1, 2, 4, 8].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSize(s),
              className: `w-6 h-5 flex items-center justify-center ${size === s ? "bevel-thin-in bg-[color:var(--muted)]" : "bevel-thin"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#000", width: s * 1.5, height: s * 1.5, borderRadius: tool === "pencil" ? 0 : "50%" } })
            },
            s
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bevel-thin-in bg-[color:var(--muted)] overflow-auto p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              width: W,
              height: H,
              onMouseDown: onDown,
              onMouseMove: onMove,
              onMouseUp: onUp,
              onMouseLeave: onUp,
              onContextMenu: (e) => e.preventDefault(),
              className: "bg-white cursor-crosshair",
              style: { imageRendering: "pixelated", width: W, height: H, display: "block" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: previewRef, width: W, height: H, className: "hidden" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-[color:var(--border-dark)] p-1 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bevel-thin-in flex flex-col p-0.5 bg-window", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-8 h-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-5 h-5 border border-black", style: { background: color } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-5 h-5 border border-black", style: { background: bgColor } })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bevel-thin-in bg-window p-0.5 grid grid-rows-2 grid-flow-col gap-0.5", children: palette.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setColor(c),
          onContextMenu: (e) => {
            e.preventDefault();
            setBgColor(c);
          },
          className: "w-4 h-4 border border-black",
          style: { background: c },
          title: `${c} (right-click for bg)`
        },
        c
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "win-btn !py-0 !px-2 text-[10px]", onClick: undo, children: "Undo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "win-btn !py-0 !px-2 text-[10px]", onClick: clear, children: "Clear" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto bevel-thin-in px-2 py-0.5 text-[10px] font-mono", children: coords })
    ] })
  ] });
}
function Guestbook() {
  const [entries, setEntries] = reactExports.useState([
    { name: "xXcoolKid99Xx", msg: "first!! sick site dude 🤘", time: "12/03/99" },
    { name: "webmistress_98", msg: "love the layout! linking u from my page", time: "10/17/99" },
    { name: "DialUpDan", msg: "took 4 minutes to load but worth it", time: "09/22/99" }
  ]);
  const [name, setName] = reactExports.useState("");
  const [msg, setMsg] = reactExports.useState("");
  const submit = () => {
    if (!name.trim() || !msg.trim()) return;
    setEntries([{ name, msg, time: (/* @__PURE__ */ new Date()).toLocaleDateString() }, ...entries]);
    setName("");
    setMsg("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 h-full flex flex-col gap-2 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bevel-thin-in bg-white p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold mb-1", children: "✍ Sign the Guestbook" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Your handle", className: "bevel-thin-in px-1 py-0.5 w-full mb-1 outline-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: msg, onChange: (e) => setMsg(e.target.value), placeholder: "Leave a message...", className: "bevel-thin-in px-1 py-0.5 w-full h-16 outline-none resize-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "win-btn mt-1", onClick: submit, children: "Submit" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto bevel-thin-in bg-white p-2 space-y-2", children: entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-dashed border-gray-400 pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-[color:var(--titlebar)]", children: [
        e.name,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-600 font-normal", children: [
          "— ",
          e.time
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px]", children: e.msg })
    ] }, i)) })
  ] });
}
function Terminal() {
  const [lines, setLines] = reactExports.useState([
    "WebOS [Version 1.0.95]",
    "(C) Copyright 1995-1999 Webcore Industries.",
    "",
    "Type 'help' for available commands.",
    ""
  ]);
  const [input, setInput] = reactExports.useState("");
  const run = (cmd) => {
    const out = [`C:\\> ${cmd}`];
    const c = cmd.trim().toLowerCase();
    if (c === "help") out.push("Commands: help, about, dir, date, hack, ena, cls, exit");
    else if (c === "about") out.push("Webcore OS — an internet aesthetic experience.");
    else if (c === "dir") out.push(" notepad.exe", " calc.exe", " paint.exe", " guestbook.htm", " secret.txt");
    else if (c === "date") out.push((/* @__PURE__ */ new Date()).toString());
    else if (c === "hack") out.push("ACCESSING MAINFRAME...", "BYPASSING FIREWALL...", "DOWNLOADING INTERNET...", "DONE. You hacked the planet. 🌍");
    else if (c === "ena") out.push("ENA found. low-poly memories loaded.");
    else if (c === "cls") {
      setLines([]);
      setInput("");
      return;
    } else if (c === "exit") out.push("Cannot exit. There is no escape.");
    else if (c === "") ;
    else out.push(`'${cmd}' is not recognized as an internal or external command.`);
    setLines((l) => [...l, ...out, ""]);
    setInput("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-black text-[#00ff00] font-mono text-[12px] h-full p-2 overflow-auto",
      style: { fontFamily: "Lucida Console, monospace" },
      onClick: (e) => e.currentTarget.querySelector("input")?.focus(),
      children: [
        lines.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap", children: l || " " }, i)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "C:\\> " }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: input,
              onChange: (e) => setInput(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") run(input);
              },
              className: "flex-1 bg-transparent outline-none text-[#00ff00]",
              autoFocus: true
            }
          )
        ] })
      ]
    }
  );
}
function Shell({ bg = "#c0c0c0", textColor = "#000", title, tagline, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100%", background: bg, color: textColor, fontFamily: "Times New Roman, serif", fontSize: "13px", padding: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("table", { width: "100%", cellPadding: 0, cellSpacing: 0, style: { borderBottom: "2px solid #808080" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "#000080" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "8px 12px", color: "#fff", fontSize: "22px", fontWeight: "bold", fontFamily: "Arial, sans-serif" }, children: title }) }),
      tagline && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "#c0c0c0" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "2px 12px", fontSize: "11px", color: "#444", fontFamily: "sans-serif", borderBottom: "1px solid #808080" }, children: tagline }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "10px 12px" }, children })
  ] });
}
function HR() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: { border: "none", borderTop: "2px solid #808080", margin: "8px 0" } });
}
function H2({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "15px", fontWeight: "bold", fontFamily: "Arial, sans-serif", color: "#000080", marginBottom: "4px" }, children });
}
function BlueLink({ href, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: href ?? "#", target: "_blank", rel: "noreferrer", style: { color: "#0000cc", textDecoration: "underline" }, children });
}
function Site_WebMuseum() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { bg: "#fffff0", title: "WebMuseum Paris", tagline: "Famous Paintings · Biographies · Guided Tours — Since 1993", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "🖼 Welcome to the WebMuseum!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The WebMuseum network, now running on 100 servers around the world! View thousands of famous artworks at no charge." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Featured Exhibitions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { style: { paddingLeft: "18px", lineHeight: 1.8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Paintings by Subject (3,200 works)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Artist Biographies — from Botticelli to Warhol" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Virtual Tour: The Louvre, Paris" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Special Exhibition: Impressionism 1860–1900" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px", color: "#888", fontFamily: "sans-serif" }, children: "★ Visitors since 1993: 14,281,003 ★ Mirror site count: 100" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "120px", border: "2px inset #808080", padding: "6px", fontSize: "11px", background: "#fff", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", marginBottom: "4px" }, children: "Quick Links" }),
      ["Artists A–Z", "Paintings", "Sculpture", "Architecture", "About"].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: l }) }, l))
    ] })
  ] }) });
}
function Site_Yahoo_Finance() {
  const stocks = [
    { ticker: "MSFT", price: "87.19", change: "+1.42", up: true },
    { ticker: "AAPL", price: "28.72", change: "-0.55", up: false },
    { ticker: "AMZN", price: "6.21", change: "+0.88", up: true },
    { ticker: "IBM", price: "112.44", change: "+0.10", up: true },
    { ticker: "AOL", price: "55.37", change: "-2.10", up: false }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { bg: "#fff", title: "Yahoo! Finance", tagline: "Your Money · Your Portfolio · Stock Quotes · News · Charts", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Market Summary — Nasdaq Composite" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { width: "100%", cellPadding: 3, style: { border: "1px solid #ccc", borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: "12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: { background: "#000080", color: "#fff" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["Symbol", "Last Trade", "Change", "% Chg"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "3px 6px", textAlign: "left" }, children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: stocks.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: i % 2 === 0 ? "#f0f0f0" : "#fff" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "2px 6px", color: "#0000cc", textDecoration: "underline", cursor: "pointer" }, children: s.ticker }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "2px 6px" }, children: s.price }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "2px 6px", color: s.up ? "#006600" : "#cc0000" }, children: s.change }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "2px 6px", color: s.up ? "#006600" : "#cc0000" }, children: s.up ? "▲" : "▼" })
      ] }, s.ticker)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Today's Headlines" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { style: { paddingLeft: "18px", lineHeight: 1.9, fontFamily: "sans-serif", fontSize: "12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Microsoft reports record Q4 earnings — shares surge 6%" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Greenspan signals possible rate cut in September" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Amazon.com IPO: Should you buy? Analysts weigh in" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Dow Jones crosses 9,000 for first time" }) })
    ] })
  ] });
}
function Site_Slashdot() {
  const posts = [
    { title: "Linux Kernel 2.2 Released — Multithreading Improved", author: "CmdrTaco", comments: 412, time: "10:32 AM" },
    { title: "Netscape Releases Navigator 4.5 Source Code", author: "Hemos", comments: 887, time: "08:15 AM" },
    { title: "Ask Slashdot: Best Free Unix for Home Use?", author: "Roblimo", comments: 1203, time: "Yesterday" },
    { title: "Y2K Bug — Hype or Real Threat? Your Opinions", author: "CmdrTaco", comments: 2041, time: "Yesterday" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { bg: "#fff", title: "Slashdot", tagline: "News for Nerds — Stuff that Matters", children: [
    posts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px dotted #ccc" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: p.title }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "11px", color: "#888", fontFamily: "sans-serif", marginTop: "2px" }, children: [
        "posted by ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: p.author }),
        " at ",
        p.time,
        "  | ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(BlueLink, { children: [
          p.comments,
          " comments"
        ] })
      ] })
    ] }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "11px", fontFamily: "sans-serif", color: "#555" }, children: [
      "Slashdot is hosted by Andover.Net · ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Submit a Story" }),
      " · ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Advertise" })
    ] })
  ] });
}
function Site_GameFAQs() {
  const games = [
    { name: "The Legend of Zelda: Ocarina of Time", system: "N64", guides: 42 },
    { name: "StarCraft", system: "PC", guides: 28 },
    { name: "Final Fantasy VII", system: "PS1", guides: 67 },
    { name: "Half-Life", system: "PC", guides: 15 },
    { name: "Pokémon Red / Blue", system: "GameBoy", guides: 53 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { bg: "#fffff0", title: "GameFAQs", tagline: "Game Guides, FAQs, Walkthroughs and Cheat Codes — Since 1995", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "📋 Most Popular FAQs This Week" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { width: "100%", cellPadding: 3, style: { borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: "12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: { background: "#000080", color: "#fff" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "3px 8px", textAlign: "left" }, children: "Game" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "3px 8px", textAlign: "left" }, children: "System" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "3px 8px", textAlign: "left" }, children: "Guides" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: games.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: i % 2 === 0 ? "#f5f5dc" : "#fff" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "3px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: g.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "3px 8px", color: "#555" }, children: g.system }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "3px 8px", color: "#555" }, children: g.guides })
      ] }, g.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "sans-serif", fontSize: "11px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Submit a FAQ" }),
      "  ·  ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Browse by Platform" }),
      "  ·  ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Cheat Codes" })
    ] })
  ] });
}
function Site_WebMD() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { bg: "#fff", title: "WebMD Health", tagline: "Better Information. Better Health. — Your trusted medical resource since 1996", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "🔍 Symptom Checker" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { border: "1px solid #ccc", padding: "8px", marginBottom: "10px", fontFamily: "sans-serif", fontSize: "12px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "6px" }, children: "Enter your symptom:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { border: "1px inset #808080", width: "180px", padding: "2px 4px", fontSize: "12px" }, placeholder: "e.g. headache", readOnly: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { marginLeft: "6px", background: "#c0c0c0", border: "2px outset #eee", padding: "1px 10px", cursor: "pointer", fontSize: "11px" }, children: "Search" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Health News" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { style: { paddingLeft: "18px", lineHeight: 1.9, fontFamily: "sans-serif", fontSize: "12px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "New study links coffee to reduced heart disease risk" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "FDA approves new antibiotic for respiratory infections" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Flu season: Are you prepared? Tips from the CDC" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "130px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#000080", color: "#fff", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }, children: "Health Topics" }),
      ["Allergies", "Cancer", "Cold & Flu", "Diabetes", "Heart", "Mental Health", "Vitamins"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: t }) }, t))
    ] })
  ] }) });
}
function Site_ThisOldHouse() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { bg: "#fffff8", title: "This Old House", tagline: "Expert Advice on Home Improvement, Remodeling & Repair — from PBS Television", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "🔨 Project of the Week" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "How to Install Hardwood Floors — Step by Step" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontFamily: "sans-serif", fontSize: "12px" }, children: "Refinishing your hardwood floors can add thousands to your home's value. Master carpenter Norm Abram walks you through the entire process from prep to finish." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Read the full guide »" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Ask Norm!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontFamily: "sans-serif", fontSize: "12px" }, children: `"My basement keeps flooding every spring. What's the best way to waterproof it without digging up the foundation?"` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px", fontStyle: "italic" }, children: "— Dave from Ohio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "See Norm's answer »" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "120px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#8b4513", color: "#fff", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }, children: "Projects" }),
      ["Plumbing", "Electrical", "Roofing", "Kitchens", "Bathrooms", "Landscaping"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: t }) }, t))
    ] })
  ] }) });
}
function Site_BBC_News() {
  const stories = [
    { time: "15:42 GMT", headline: "Clinton addresses Congress on economic surplus" },
    { time: "14:20 GMT", headline: "Euro currency preparations in final stage across 11 nations" },
    { time: "13:05 GMT", headline: "Scientists clone first mammal — Dolly the sheep update" },
    { time: "11:30 GMT", headline: "England cricket team prepares for Ashes series" },
    { time: "09:44 GMT", headline: "Y2K: Is your bank ready? What savers need to know" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { bg: "#fff", title: "BBC News Online", tagline: "World Service · UK · Technology · Sport · Entertainment — Updated Every 10 Minutes", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Latest Headlines" }),
      stories.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "8px", marginBottom: "6px", fontFamily: "sans-serif", fontSize: "12px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888", minWidth: "70px", flexShrink: 0 }, children: s.time }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: s.headline })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Full World Service News →" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "120px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#bb0000", color: "#fff", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }, children: "Sections" }),
      ["UK", "World", "Politics", "Business", "Science", "Health", "Sport", "Entertainment"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: t }) }, t))
    ] })
  ] }) });
}
function Site_AllTrails() {
  const trails = [
    { name: "Appalachian Trail — White Mountains Section", dist: "22 mi", diff: "Hard", rating: "★★★★★" },
    { name: "Grand Canyon — South Rim Rim Trail", dist: "13 mi", diff: "Easy", rating: "★★★★☆" },
    { name: "Yosemite — Half Dome via John Muir Trail", dist: "16 mi", diff: "Hard", rating: "★★★★★" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { bg: "#f5fff5", title: "TrailFinder Online", tagline: "Hike It. Love It. Share It. — 10,000+ Trails Nationwide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "🥾 Popular Trails Near You" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { width: "100%", cellPadding: 4, style: { borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: "12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: { background: "#006600", color: "#fff" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["Trail Name", "Distance", "Difficulty", "Rating"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "3px 8px", textAlign: "left" }, children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: trails.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: i % 2 === 0 ? "#e8f5e8" : "#fff" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "3px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: t.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "3px 8px" }, children: t.dist }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "3px 8px", color: t.diff === "Hard" ? "#cc0000" : "#006600" }, children: t.diff }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "3px 8px" }, children: t.rating })
      ] }, t.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Trail Tips" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { style: { paddingLeft: "18px", lineHeight: 1.8, fontFamily: "sans-serif", fontSize: "12px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Always tell someone where you are going" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Carry at least 2 liters of water per person" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Download our FREE printable trail maps (PDF)" }) })
    ] })
  ] });
}
function Site_Wikipedia() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { bg: "#fff", title: "Nupedia — The Free Encyclopedia", tagline: "The Open Encyclopedia That Anyone Can Edit — Est. 1999", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { border: "1px solid #aaa", padding: "8px", marginBottom: "10px", background: "#f9f9f9", fontFamily: "sans-serif", fontSize: "12px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Search the encyclopedia:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { border: "1px inset #808080", width: "200px", padding: "2px 4px", marginTop: "4px", fontSize: "12px" }, placeholder: "Article title", readOnly: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { marginLeft: "6px", background: "#c0c0c0", border: "2px outset #eee", padding: "1px 10px", cursor: "pointer", fontSize: "11px" }, children: "Go" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Featured Article: World Wide Web" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontFamily: "sans-serif", fontSize: "12px", lineHeight: 1.6 }, children: [
        "The ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "World Wide Web" }),
        " (also called the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Web" }),
        ") is an information space in which the items of interest, referred to as resources, are identified by global identifiers called Uniform Resource Locators (URLs)..."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Read more →" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "Recently Updated Articles" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { style: { paddingLeft: "18px", lineHeight: 1.9, fontFamily: "sans-serif", fontSize: "12px" }, children: ["Y2K Problem", "Napster (software)", "Euro currency", "International Space Station", "Human Genome Project"].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: a }) }, a)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "120px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#000080", color: "#fff", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }, children: "Browse" }),
      ["Arts", "History", "Science", "Geography", "People", "Technology", "Sports"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: t }) }, t))
    ] })
  ] }) });
}
function Site_NASA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { bg: "#000020", textColor: "#fff", title: "NASA — National Aeronautics and Space Administration", tagline: "Exploring The Universe · For The Benefit of All", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "🚀 Mission News" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { style: { paddingLeft: "18px", lineHeight: 1.9, color: "#7df", fontFamily: "sans-serif", fontSize: "12px" }, children: [
        "Mars Pathfinder Mission — Week 14 update",
        "Hubble Space Telescope: New images of Crab Nebula released",
        "STS-95 Shuttle Mission — John Glenn returns to space",
        "International Space Station — Module Alpha delivered"
      ].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", style: { color: "#7df", textDecoration: "underline" }, children: n }) }, n)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#000040", border: "1px solid #00f", padding: "8px", fontFamily: "sans-serif", fontSize: "11px", color: "#adf" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", color: "#ff0", marginBottom: "4px" }, children: "🌌 Picture of the Day" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "60px", background: "linear-gradient(135deg, #000020, #000080, #200040)", display: "flex", alignItems: "center", justifyContent: "center", color: "#adf", fontSize: "10px", border: "1px solid #00f" }, children: "[Hubble Deep Field Image]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "4px" }, children: "Hubble Ultra Deep Field — 10,000 galaxies in one image" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "120px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#000080", color: "#7df", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }, children: "Centers" }),
      ["JPL", "JSC Houston", "Kennedy", "Goddard", "Ames", "Marshall"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", style: { color: "#7df", textDecoration: "underline" }, children: t }) }, t))
    ] })
  ] }) });
}
function Site_Amazon() {
  const books = [
    { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", price: "$12.99" },
    { title: "The World Is Flat", author: "Thomas L. Friedman", price: "$14.99" },
    { title: "Men Are from Mars, Women Are from Venus", author: "John Gray", price: "$10.99" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { bg: "#fff", title: "Amazon.com", tagline: "Earth's Biggest Bookstore — Books, Music, VHS, and More!", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "sans-serif", fontSize: "12px", border: "1px solid #ccc", padding: "6px", marginBottom: "10px", background: "#fffde7" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Search:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { style: { marginLeft: "6px", fontSize: "11px", border: "1px solid #808080" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Books" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Music" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Videos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { marginLeft: "6px", border: "1px inset #808080", width: "160px", padding: "2px 4px", fontSize: "12px" }, placeholder: "", readOnly: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { marginLeft: "6px", background: "#ff9900", border: "2px outset #ffcc66", padding: "1px 10px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }, children: "Go!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "📚 Bestsellers This Week" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("table", { width: "100%", cellPadding: 4, style: { borderCollapse: "collapse", fontSize: "12px" }, children: books.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: i % 2 === 0 ? "#fff8f0" : "#fff", borderBottom: "1px solid #eee" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "4px 6px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: b.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: b.author })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "4px 6px", color: "#900", fontWeight: "bold", textAlign: "right" }, children: b.price })
    ] }, b.title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "11px", color: "#555" }, children: [
      "©1998 Amazon.com, Inc. · ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Shopping Cart" }),
      " · ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: "Your Account" }),
      " · 1-Click Ordering™"
    ] })
  ] });
}
function Site_MoveOn() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { bg: "#fff", title: "MoveOn.org Political Action", tagline: "Democracy in Action — Civic Petitions · Grassroots Campaigns · Get Involved", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(H2, { children: "📢 Active Campaigns" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "sans-serif", fontSize: "12px" }, children: [
      { title: "Stop Campaign Finance Corruption — Sign the Petition", sigs: "142,088 signatures" },
      { title: "Save Public Broadcasting — Oppose Budget Cuts", sigs: "98,441 signatures" },
      { title: "Clean Air Act: Tell Congress to Act Now", sigs: "204,991 signatures" }
    ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { border: "1px solid #ccc", padding: "8px", marginBottom: "8px", background: "#f8f8ff" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlueLink, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: c.title }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#006600", marginTop: "2px" }, children: [
        "✔ ",
        c.sigs
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { marginTop: "4px", background: "#000080", color: "#fff", border: "none", padding: "2px 10px", cursor: "pointer", fontSize: "11px" }, children: "Add Your Name" })
    ] }, c.title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HR, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "sans-serif", fontSize: "11px", color: "#555" }, children: "MoveOn.org is a 501(c)(4) nonprofit organization. ©1998 MoveOn.org PAC" })
  ] });
}
const RETRO_SITE_COMPONENTS = {
  webmuseum: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_WebMuseum, {}),
  yahoo_finance: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_Yahoo_Finance, {}),
  slashdot: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_Slashdot, {}),
  gamefaqs: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_GameFAQs, {}),
  webmd: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_WebMD, {}),
  thisoldhouse: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_ThisOldHouse, {}),
  bbc: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_BBC_News, {}),
  alltrails: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_AllTrails, {}),
  wikipedia: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_Wikipedia, {}),
  nasa: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_NASA, {}),
  amazon: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_Amazon, {}),
  moveon: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Site_MoveOn, {})
};
const RETRO_SITE_URLS = {
  webmuseum: "http://www.webmuseum.paris.org",
  yahoo_finance: "http://finance.yahoo.com",
  slashdot: "http://slashdot.org",
  gamefaqs: "http://www.gamefaqs.com",
  webmd: "http://www.webmd.com",
  thisoldhouse: "http://www.thisoldhouse.com",
  bbc: "http://news.bbc.co.uk",
  alltrails: "http://www.trailfinder.com",
  wikipedia: "http://www.nupedia.com",
  nasa: "http://www.nasa.gov",
  amazon: "http://www.amazon.com",
  moveon: "http://www.moveon.org"
};
const PAGES = {
  "C:\\Users\\Home\\index.html": "home",
  "http://www.search98.com": "search",
  "http://webring.net/links": "links",
  "http://portfolio.local/work": "portfolio",
  // retro site URLs
  ...Object.fromEntries(
    Object.entries(RETRO_SITE_URLS).map(([id, url]) => [url, `site:${id}`])
  )
};
const PAGE_URLS = {
  home: "C:\\Users\\Home\\index.html",
  search: "http://www.search98.com",
  links: "http://webring.net/links",
  portfolio: "http://portfolio.local/work",
  // retro site URLs
  ...Object.fromEntries(
    Object.entries(RETRO_SITE_URLS).map(([id, url]) => [`site:${id}`, url])
  )
};
function GeoHome({ navigate }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        minHeight: "100%",
        background: "#000080",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='10' height='10' fill='%23000099'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23000099'/%3E%3C/svg%3E")`,
        backgroundSize: "20px 20px",
        fontFamily: "Times New Roman, serif",
        color: "#ffff00",
        fontSize: "14px",
        padding: "8px",
        overflowY: "auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              background: "#000",
              border: "3px ridge #ff0",
              marginBottom: "8px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              padding: "4px 0"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  display: "inline-block",
                  animation: "ns-marquee 18s linear infinite",
                  color: "#00ff00",
                  fontFamily: "Courier New, monospace",
                  fontSize: "13px"
                },
                children: "★★★ WELCOME TO MY HOMEPAGE!! ★★★     ✦ Best viewed at 800×600 in Netscape Navigator 4.0 ✦     ★★★ WELCOME TO MY HOMEPAGE!! ★★★     ✦ Best viewed at 800×600 in Netscape Navigator 4.0 ✦"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "28px", textShadow: "2px 2px #f00", fontWeight: "bold", color: "#ff0" }, children: "✧ My Kewl HoMePaGe ✧" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px", color: "#00ffff" }, children: "★ Est. 1997 · Last updated 4/20/99 ★" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "16px", marginBottom: "12px", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/under_construction.png",
              alt: "Under Construction",
              style: { width: "88px", imageRendering: "pixelated", border: "2px solid #ff0" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px", color: "#c0c0c0" }, children: "👁 You are visitor #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  fontFamily: "Courier New, monospace",
                  fontSize: "18px",
                  color: "#00ff00",
                  background: "#000",
                  padding: "2px 8px",
                  border: "2px inset #888",
                  letterSpacing: "4px"
                },
                children: "002048"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                animation: "ns-blink 1s steps(2) infinite",
                fontSize: "22px"
              },
              children: "🚧"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderTop: "3px double #ff0", marginBottom: "10px" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "rgba(0,0,0,0.6)",
              border: "2px ridge #888",
              padding: "8px",
              marginBottom: "10px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff6600", fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }, children: "♦ About Me ♦" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "0 0 6px", color: "#fff", fontSize: "13px", lineHeight: 1.5 }, children: [
                "Hi!! Welcome 2 my little corner of the WWW!! Im a web designer and total computer geek lol. I luv ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ff0" }, children: "HTML" }),
                ", ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#0ff" }, children: "Star Wars" }),
                ", and listening to mp3z on Winamp. 🎵"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "0", color: "#fff", fontSize: "13px", lineHeight: 1.5 }, children: [
                "This site is",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#f00", fontWeight: "bold", animation: "ns-blink 1s steps(2) infinite", display: "inline-block" }, children: "ALWAYS UNDER CONSTRUCTION" }),
                " ",
                "so plz bear w/ me!! More stuff coming soooon!!!"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "rgba(0,0,128,0.5)",
              border: "2px groove #aaa",
              padding: "8px",
              marginBottom: "10px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff0", fontWeight: "bold", marginBottom: "6px" }, children: "⚡ Quick Links ⚡" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                ["🔍 Search the Web", "search"],
                ["🔗 My Links & Socials", "links"],
                ["💼 View My Portfolio", "portfolio"]
              ].map(([label, page]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => navigate(page),
                  style: {
                    background: "none",
                    border: "none",
                    color: "#00ffff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontFamily: "Times New Roman, serif",
                    fontSize: "13px",
                    textAlign: "left",
                    padding: 0
                  },
                  children: label
                },
                page
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#ff6600", fontWeight: "bold", marginBottom: "4px" }, children: "📖 Sign My Guestbook!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#c0c0c0", fontSize: "11px" }, children: "[Guestbook v2.3 — powered by CGI-bin]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderTop: "3px double #ff0", paddingTop: "6px", textAlign: "center", fontSize: "10px", color: "#888" }, children: "© 1997–1999  |  Best @ 800×600  |  Netscape 4.0+  |  No Frames plz" })
      ]
    }
  );
}
const CATEGORY_SITES = {
  Arts: [
    { title: "Web Museum — Famous Paintings Online", url: "https://www.wga.hu", desc: "The Web Gallery of Art — thousands of European paintings from the 8th–19th century, fully searchable." },
    { title: "The Louvre — Collections Online", url: "https://collections.louvre.fr/en", desc: "Browse 480,000 artworks from the Musée du Louvre directly in your browser. Free access." },
    { title: "DeviantArt — Online Art Community", url: "https://www.deviantart.com", desc: "The world's largest online art community. Share and discover digital and traditional artwork." }
  ],
  Business: [
    { title: "Yahoo! Finance — Stock Quotes & News", url: "https://finance.yahoo.com", desc: "Real-time stock quotes, business news, financial data and portfolio management tools." },
    { title: "Inc. Magazine — Small Business Resources", url: "https://www.inc.com", desc: "Advice, tips, and resources for entrepreneurs and small business owners." },
    { title: "Entrepreneur.com — Start Your Business", url: "https://www.entrepreneur.com", desc: "Startup ideas, franchise info, business plans and marketing strategies for 1998 and beyond." }
  ],
  Computers: [
    { title: "Slashdot — News for Nerds", url: "https://slashdot.org", desc: "News for nerds, stuff that matters. Technology and open-source software discussion since 1997." },
    { title: "HowStuffWorks — Technology Explained", url: "https://computer.howstuffworks.com", desc: "Plain-English explanations of how computers, the internet, and technology actually work." },
    { title: "W3Schools — Web Tutorials", url: "https://www.w3schools.com", desc: "HTML, CSS, JavaScript, and web development tutorials. The beginner's guide to building websites." }
  ],
  Games: [
    { title: "GameFAQs — Game Guides & Cheats", url: "https://www.gamefaqs.com", desc: "Walkthroughs, FAQs, and cheat codes for thousands of games across all platforms." },
    { title: "IGN — Video Game News & Reviews", url: "https://www.ign.com", desc: "The latest video game reviews, previews, cheats, trailers, and news from IGN." },
    { title: "Miniclip — Free Online Games", url: "https://www.miniclip.com", desc: "Play hundreds of free online games directly in your browser. No download required." }
  ],
  Health: [
    { title: "WebMD — Medical Information", url: "https://www.webmd.com", desc: "Trusted medical information, symptom checkers, drug reference, and health news." },
    { title: "NIH — National Institutes of Health", url: "https://www.nih.gov", desc: "Official U.S. government health information from the National Institutes of Health." },
    { title: "Mayo Clinic — Patient Care & Health Info", url: "https://www.mayoclinic.org", desc: "Expert, reliable health and medical information from one of America's top hospitals." }
  ],
  Home: [
    { title: "This Old House — Home Improvement", url: "https://www.thisoldhouse.com", desc: "Expert advice on home improvement, remodeling, gardening, and home maintenance." },
    { title: "Better Homes & Gardens", url: "https://www.bhg.com", desc: "Ideas and inspiration for home décor, recipes, crafts, gardening, and entertaining." },
    { title: "Apartment Therapy — Home Design", url: "https://www.apartmenttherapy.com", desc: "Small-space living, budget decorating, and home tours from real people's homes." }
  ],
  News: [
    { title: "BBC News Online — World Service", url: "https://www.bbc.com/news", desc: "International news coverage from the British Broadcasting Corporation." },
    { title: "Reuters — Breaking News", url: "https://www.reuters.com", desc: "Real-time international news from Reuters wire service. Business, politics, world events." },
    { title: "The Guardian — News & Opinion", url: "https://www.theguardian.com", desc: "Independent journalism covering world news, politics, technology, sport and culture." }
  ],
  Recreation: [
    { title: "AllTrails — Hiking & Outdoor Maps", url: "https://www.alltrails.com", desc: "Find trails for hiking, biking, and running. Trail maps, photos, and reviews." },
    { title: "REI — Outdoor Gear & Adventures", url: "https://www.rei.com", desc: "Outdoor gear, clothing, and expert advice for hiking, camping, climbing, and more." },
    { title: "Roadtrippers — Trip Planning", url: "https://roadtrippers.com", desc: "Plan the perfect road trip with points of interest, campgrounds, and weird roadside attractions." }
  ],
  Reference: [
    { title: "Wikipedia — The Free Encyclopedia", url: "https://en.wikipedia.org", desc: "The world's largest free encyclopedia. Over 6 million articles in English." },
    { title: "Merriam-Webster — Dictionary & Thesaurus", url: "https://www.merriam-webster.com", desc: "America's most trusted dictionary since 1828. Word definitions, synonyms, and etymology." },
    { title: "Bartleby — Classic Literature & Reference", url: "https://www.bartleby.com", desc: "Free access to classic literature, poetry, quotations, encyclopedias and reference books." }
  ],
  Science: [
    { title: "NASA — Space Science & Exploration", url: "https://www.nasa.gov", desc: "Space exploration news, missions, astronomy images, and scientific research from NASA." },
    { title: "National Geographic — Science & Nature", url: "https://www.nationalgeographic.com", desc: "Photography, science, exploration, and stories about our world from National Geographic." },
    { title: "New Scientist — Science News", url: "https://www.newscientist.com", desc: "The latest science and technology news, analysis and expert comment from New Scientist." }
  ],
  Shopping: [
    { title: "Amazon.com — Books, Music & More", url: "https://www.amazon.com", desc: "Earth's biggest selection of books, CDs, videos, DVDs, toys, electronics and more." },
    { title: "eBay — Person-to-Person Auction Site", url: "https://www.ebay.com", desc: "Buy and sell anything! Collectibles, electronics, antiques, or just about anything else." },
    { title: "PriceWatch — Lowest PC Prices", url: "https://www.pricewatch.com", desc: "Compare prices on computer hardware, software, and electronics from hundreds of merchants." }
  ],
  Society: [
    { title: "MoveOn — Online Political Action", url: "https://www.moveon.org", desc: "Grassroots political action, petitions, and civic engagement tools for everyone." },
    { title: "Amnesty International", url: "https://www.amnesty.org", desc: "Human rights news, campaigns and actions from Amnesty International." },
    { title: "United Nations — Official Site", url: "https://www.un.org", desc: "International peace and security, humanitarian aid, and sustainable development from the UN." }
  ]
};
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function SearchPage({ navigate }) {
  const [query, setQuery] = reactExports.useState("");
  const [results, setResults] = reactExports.useState(null);
  const [activeCat, setActiveCat] = reactExports.useState(null);
  const [catSites, setCatSites] = reactExports.useState([]);
  const search = () => {
    if (query.trim()) {
      setResults("shown");
      setActiveCat(null);
    }
  };
  const lucky = () => navigate("portfolio");
  const openCategory = (cat) => {
    const pool = CATEGORY_SITES[cat];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setCatSites(shuffled.slice(0, 2));
    setActiveCat(cat);
    setResults("category");
  };
  const ROW1 = ["Arts", "Business", "Computers", "Games", "Health", "Home"];
  const ROW2 = ["News", "Recreation", "Reference", "Science", "Shopping", "Society"];
  const resultBlock = (sites, label, count) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "sans-serif", fontSize: "13px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: "11px", marginBottom: "10px" }, children: [
      "Search98 found about ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: count }),
      " results for ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        '"',
        label,
        '"'
      ] }),
      " (0.",
      Math.floor(Math.random() * 89) + 10,
      " seconds)"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: { marginBottom: "10px" } }),
    sites.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "14px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: r.url,
          target: "_blank",
          rel: "noreferrer",
          style: {
            color: "#1a0dab",
            textDecoration: "underline",
            fontSize: "15px",
            fontWeight: "bold"
          },
          children: r.title
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#006621", fontSize: "11px" }, children: r.url }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#444", fontSize: "12px", marginTop: "2px" }, children: r.desc })
    ] }, r.url + r.title)),
    [
      { title: "💼 My Portfolio — Case Studies & Projects", url: "http://portfolio.local/work", desc: "A curated collection of web design and development work.", page: "portfolio" },
      { title: "🔗 Links & Socials — GitHub, LinkedIn, Email", url: "http://webring.net/links", desc: "Connect on GitHub, LinkedIn, Twitter, and more.", page: "links" }
    ].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "14px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate(r.page),
          style: { background: "none", border: "none", color: "#1a0dab", textDecoration: "underline", cursor: "pointer", fontSize: "15px", fontWeight: "bold", padding: 0, textAlign: "left" },
          children: r.title
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#006621", fontSize: "11px" }, children: r.url }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#444", fontSize: "12px", marginTop: "2px" }, children: r.desc })
    ] }, r.title))
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minHeight: "100%", background: "#fff", fontFamily: "Times New Roman, serif", padding: "8px", overflowY: "auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "12px", display: "flex", gap: "12px", fontSize: "11px", color: "#00c" }, children: ["Web", "Images", "Groups", "News", "Directory", "More »"].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { cursor: "pointer", textDecoration: "underline" }, children: l }, l)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "18px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "40px", fontWeight: "bold", fontFamily: "Arial Black, sans-serif", lineHeight: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#3c78d8" }, children: "S" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#dc3545" }, children: "e" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#f4b400" }, children: "a" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#3c78d8" }, children: "r" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#0f9d58" }, children: "c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#dc3545" }, children: "h" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#3c78d8" }, children: "9" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#f4b400" }, children: "8" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "10px", color: "#888", fontFamily: "sans-serif" }, children: "Searching 3.1 Million Pages on the World Wide Web!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "16px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && search(),
          style: { width: "320px", padding: "4px 6px", border: "1px solid #ccc", fontSize: "14px", fontFamily: "sans-serif", outline: "none" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px" }, children: ["Search!", "I'm Feeling Lucky"].map((label) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: label === "Search!" ? search : lucky,
          style: { background: "#c0c0c0", border: "2px outset #eee", padding: "3px 14px", fontFamily: "sans-serif", fontSize: "12px", cursor: "pointer" },
          children: label
        },
        label
      )) })
    ] }),
    results === null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", fontSize: "12px", fontFamily: "sans-serif" }, children: [ROW1, ROW2].map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: "24px", marginBottom: "8px" }, children: row.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        onClick: () => openCategory(cat),
        style: { color: "#00c", textDecoration: "underline", cursor: "pointer" },
        title: `${CATEGORY_SITES[cat].length} sites`,
        children: cat
      },
      cat
    )) }, ri)) }),
    results === "category" && activeCat && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "sans-serif", fontSize: "11px", marginBottom: "10px", color: "#444" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            onClick: () => {
              setResults(null);
              setActiveCat(null);
            },
            style: { color: "#00c", textDecoration: "underline", cursor: "pointer" },
            children: "← Directory"
          }
        ),
        " ",
        "› ",
        activeCat,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            onClick: () => openCategory(activeCat),
            style: { marginLeft: "12px", color: "#00c", textDecoration: "underline", cursor: "pointer", fontSize: "10px" },
            title: "Pick different sites",
            children: "↻ show others"
          }
        )
      ] }),
      resultBlock(catSites, activeCat, CATEGORY_SITES[activeCat].length * 3412)
    ] }),
    results === "shown" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "sans-serif", fontSize: "11px", marginBottom: "10px", color: "#444" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          onClick: () => {
            setResults(null);
            setQuery("");
          },
          style: { color: "#00c", textDecoration: "underline", cursor: "pointer" },
          children: "← Back"
        }
      ) }),
      resultBlock(
        pickRandom(Object.values(CATEGORY_SITES)).slice(0, 2),
        query,
        Math.floor(Math.random() * 900) + 100
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderTop: "1px solid #ccc", marginTop: "16px", paddingTop: "6px", textAlign: "center", fontSize: "10px", color: "#888", fontFamily: "sans-serif" }, children: "©1998 Search98 Inc. · Advertising · About · Privacy" })
  ] });
}
const BADGE_STYLE = {
  display: "inline-block",
  width: 88,
  height: 31,
  fontSize: "9px",
  fontFamily: "sans-serif",
  lineHeight: "1.1",
  textAlign: "center",
  border: "1px solid #000",
  cursor: "pointer",
  textDecoration: "none",
  verticalAlign: "middle",
  overflow: "hidden",
  flexShrink: 0
};
const BADGES = [
  { label: "Best Viewed in\nNetscape 4.0", bg: "#003366", color: "#fff", href: "#", accent: "#ff6600" },
  { label: "✓ Valid HTML\n4.01", bg: "#00439c", color: "#fff", href: "#", accent: "#ffcc00" },
  { label: "GitHub\nProfile", bg: "#24292e", color: "#fff", href: "https://github.com", accent: "#6e40c9" },
  { label: "LinkedIn\nProfile", bg: "#0077b5", color: "#fff", href: "https://linkedin.com", accent: "#fff" },
  { label: "📧 Send\nEmail", bg: "#c00", color: "#fff", href: "mailto:you@example.com", accent: "#ff0" },
  { label: "Made with\n♥ GeoCities", bg: "#ff6600", color: "#fff", href: "#", accent: "#000" },
  { label: "Powered\nby Bun 🐢", bg: "#fbf0df", color: "#be5b25", href: "https://bun.sh", accent: "#be5b25" },
  { label: "Get\nNetscape!", bg: "#009900", color: "#fff", href: "#", accent: "#ff0" },
  { label: "FREE\nHOMEPAGE", bg: "#8b0000", color: "#ffff00", href: "#", accent: "#ff0" },
  { label: "Twitter / X\nProfile", bg: "#000", color: "#fff", href: "https://twitter.com", accent: "#1d9bf0" },
  { label: "RSS\nFeed", bg: "#f60", color: "#fff", href: "#", accent: "#fff" },
  { label: "No Frames!\nPlease", bg: "#444", color: "#fff", href: "#", accent: "#0f0" }
];
function LinksPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        minHeight: "100%",
        background: "#c0c0c0",
        fontFamily: "Times New Roman, serif",
        padding: "8px",
        overflowY: "auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#000080",
              color: "#fff",
              padding: "6px 10px",
              marginBottom: "10px",
              borderTop: "2px solid #fff",
              borderLeft: "2px solid #fff",
              borderRight: "2px solid #808080",
              borderBottom: "2px solid #808080"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "16px", fontWeight: "bold" }, children: "🌐 Links & Socials" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "10px", color: "#adf" }, children: "Netring member since 1997 · ID #4022" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "12px", marginBottom: "8px" }, children: "Click any badge below to visit! All links open in a new window." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              border: "2px groove #808080",
              background: "#d4d0c8",
              padding: "6px",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontFamily: "sans-serif"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { background: "#c0c0c0", border: "2px outset #fff", padding: "2px 10px", cursor: "pointer", fontSize: "11px" }, children: "◀ Prev" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, textAlign: "center", color: "#000080", fontWeight: "bold" }, children: "✦ WebRing: Personal Homepages ✦" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { background: "#c0c0c0", border: "2px outset #fff", padding: "2px 10px", cursor: "pointer", fontSize: "11px" }, children: "Next ▶" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              border: "2px inset #808080",
              background: "#fff",
              padding: "10px",
              marginBottom: "12px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: "12px", marginBottom: "8px", fontFamily: "sans-serif" }, children: "My Link Badges — Right-click to save!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px"
                  },
                  children: BADGES.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: b.href,
                      target: "_blank",
                      rel: "noreferrer",
                      title: b.label.replace("\n", " "),
                      style: {
                        ...BADGE_STYLE,
                        background: b.bg,
                        color: b.color,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2px",
                        boxSizing: "border-box"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              borderBottom: `2px solid ${b.accent ?? "#fff"}`,
                              width: "100%",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "9px",
                              paddingBottom: "1px",
                              marginBottom: "1px"
                            },
                            children: b.label.split("\n")[0]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "8px" }, children: b.label.split("\n")[1] })
                      ]
                    },
                    i
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              border: "2px groove #808080",
              background: "#d4d0c8",
              padding: "8px",
              fontFamily: "sans-serif",
              fontSize: "12px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", marginBottom: "6px" }, children: "📬 Contact Me Directly" }),
              [
                ["🐙 GitHub", "github.com/yourhandle", "https://github.com"],
                ["💼 LinkedIn", "linkedin.com/in/yourname", "https://linkedin.com"],
                ["🐦 Twitter / X", "@yourhandle", "https://twitter.com"],
                ["📧 Email", "you@example.com", "mailto:you@example.com"]
              ].map(([icon, label, href]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "4px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { minWidth: "80px", display: "inline-block" }, children: icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, target: "_blank", rel: "noreferrer", style: { color: "#000080" }, children: label })
              ] }, label))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "10px", textAlign: "center", fontSize: "10px", color: "#666" }, children: [
          "© 1998 My Netring Page · part of the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#000080", textDecoration: "underline", cursor: "pointer" }, children: "Personal Sites Webring" })
        ] })
      ]
    }
  );
}
const PROJECTS = [
  {
    title: "Webcore OS",
    year: "2024",
    tags: ["React", "TanStack Start", "TypeScript", "Vite"],
    desc: "A retro Win98-style desktop environment running entirely in the browser. Features a draggable window manager, Paint, Notepad, Calculator, Terminal, and Guestbook — all styled with authentic Windows 98 chrome.",
    link: "#",
    color: "#6366f1"
  },
  {
    title: "Design System Alpha",
    year: "2023",
    tags: ["CSS", "Storybook", "Tokens"],
    desc: "A zero-dependency design token system and component library spanning 40+ UI components. Built to be framework-agnostic and tree-shakeable.",
    link: "#",
    color: "#0ea5e9"
  },
  {
    title: "Real-time Collab Canvas",
    year: "2023",
    tags: ["WebSockets", "Canvas API", "Node.js"],
    desc: "A multiplayer whiteboard with live cursors, pressure-sensitive drawing, and persistent rooms. Handles 200+ concurrent users via CRDT-based sync.",
    link: "#",
    color: "#10b981"
  },
  {
    title: "CLI Scaffold Tool",
    year: "2022",
    tags: ["Bun", "TypeScript", "CLI"],
    desc: "A interactive project scaffolder that generates opinionated monorepo setups with CI, linting, and testing pre-configured. Published on npm.",
    link: "#",
    color: "#f59e0b"
  }
];
function PortfolioPage() {
  const [active, setActive] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        minHeight: "100%",
        background: "#0f0f13",
        color: "#e2e8f0",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflowY: "auto",
        padding: "0"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#1e1e2e",
              borderBottom: "1px solid #2d2d44",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#666"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "portfolio.local/work" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#4ade80", fontSize: "10px" }, children: "● LIVE" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "28px 20px 20px",
              background: "linear-gradient(135deg, #0f0f13 0%, #1a1a2e 100%)",
              borderBottom: "1px solid #1e1e2e"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    display: "inline-block",
                    fontSize: "10px",
                    color: "#6366f1",
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "20px",
                    padding: "2px 10px",
                    marginBottom: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase"
                  },
                  children: "Available for work"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "h1",
                {
                  style: {
                    fontSize: "26px",
                    fontWeight: 800,
                    margin: "0 0 8px",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.1
                  },
                  children: [
                    "Hi, I'm",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          background: "linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        },
                        children: "Your Name"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "13px", color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.6, maxWidth: "380px" }, children: "Frontend engineer obsessed with performance, accessibility, and occasionally wrapping modern interfaces inside retro Windows 98 chrome." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: ["React", "TypeScript", "Node.js", "Bun", "CSS", "WebGL"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: "10px",
                    background: "#1e1e2e",
                    border: "1px solid #2d2d44",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    color: "#94a3b8"
                  },
                  children: s
                },
                s
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "16px 20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }, children: "Selected Work" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: PROJECTS.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setActive(active === i ? null : i),
              style: {
                background: active === i ? "#1a1a2e" : "#141420",
                border: `1px solid ${active === i ? p.color + "55" : "#1e1e2e"}`,
                borderLeft: `3px solid ${p.color}`,
                borderRadius: "0 6px 6px 0",
                padding: "10px 14px",
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, fontSize: "14px", color: "#f1f5f9" }, children: p.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "10px", color: "#4a5568", marginLeft: "8px" }, children: p.year })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "12px", color: "#4a5568" }, children: active === i ? "▲" : "▼" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "4px", flexWrap: "wrap" }, children: p.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontSize: "9px",
                      color: p.color,
                      background: p.color + "18",
                      border: `1px solid ${p.color}33`,
                      borderRadius: "3px",
                      padding: "1px 5px"
                    },
                    children: t
                  },
                  t
                )) }),
                active === i && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "12px", color: "#94a3b8", margin: "8px 0 0", lineHeight: 1.6 }, children: p.desc })
              ]
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              margin: "0 20px 20px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(56,189,248,0.05))",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "8px",
              textAlign: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "13px", fontWeight: 600, marginBottom: "4px" }, children: "Let's build something great" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "11px", color: "#64748b" }, children: "you@example.com  ·  github.com/yourhandle" })
            ]
          }
        )
      ]
    }
  );
}
function NetscapeNavigator() {
  const [currentPage, setCurrentPage] = reactExports.useState("home");
  const [urlBar, setUrlBar] = reactExports.useState(PAGE_URLS["home"]);
  const [historyStack, setHistoryStack] = reactExports.useState(["home"]);
  const [historyIdx, setHistoryIdx] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(false);
  const loadTimerRef = reactExports.useRef(null);
  const navigateTo = reactExports.useCallback((page) => {
    setLoading(true);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      setCurrentPage(page);
      setUrlBar(PAGE_URLS[page]);
      setHistoryIdx((prevIdx) => {
        setHistoryStack((h) => [...h.slice(0, prevIdx + 1), page]);
        return prevIdx + 1;
      });
      setLoading(false);
    }, 180);
  }, []);
  const goBack = () => {
    if (historyIdx <= 0) return;
    const newIdx = historyIdx - 1;
    const page = historyStack[newIdx];
    setHistoryIdx(newIdx);
    setCurrentPage(page);
    setUrlBar(PAGE_URLS[page]);
  };
  const goForward = () => {
    if (historyIdx >= historyStack.length - 1) return;
    const newIdx = historyIdx + 1;
    const page = historyStack[newIdx];
    setHistoryIdx(newIdx);
    setCurrentPage(page);
    setUrlBar(PAGE_URLS[page]);
  };
  const handleGo = () => {
    const trimmed = urlBar.trim();
    const key = PAGES[trimmed];
    if (key) {
      navigateTo(key);
    } else {
      const found = Object.keys(PAGES).find((k) => k.toLowerCase().includes(trimmed.toLowerCase()));
      if (found) navigateTo(PAGES[found]);
    }
  };
  const canBack = historyIdx > 0;
  const canFwd = historyIdx < historyStack.length - 1;
  const toolbarBtnStyle = {
    background: "#c0c0c0",
    border: "2px outset #e0e0e0",
    padding: "2px 10px",
    fontFamily: "MS Sans Serif, Tahoma, sans-serif",
    fontSize: "11px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    lineHeight: 1.1,
    minWidth: "40px",
    userSelect: "none"
  };
  const toolbarBtnDisabled = {
    ...toolbarBtnStyle,
    color: "#808080",
    cursor: "default"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "#c0c0c0",
        fontFamily: "MS Sans Serif, Tahoma, sans-serif",
        fontSize: "12px"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "flex",
              gap: "2px",
              padding: "1px 4px",
              background: "#c0c0c0",
              borderBottom: "1px solid #808080",
              fontSize: "11px"
            },
            children: ["File", "Edit", "View", "Go", "Communicator", "Help"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: { padding: "1px 6px", cursor: "default" },
                onMouseEnter: (e) => {
                  e.target.style.background = "#000080";
                  e.target.style.color = "#fff";
                },
                onMouseLeave: (e) => {
                  e.target.style.background = "";
                  e.target.style.color = "";
                },
                children: m
              },
              m
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "2px",
              padding: "3px 4px",
              background: "#c0c0c0",
              borderBottom: "2px solid #808080",
              boxShadow: "inset 0 -1px 0 #fff"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: goBack,
                  disabled: !canBack,
                  style: canBack ? toolbarBtnStyle : toolbarBtnDisabled,
                  title: "Back",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "16px", lineHeight: 1 }, children: "◀" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "9px" }, children: "Back" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: goForward,
                  disabled: !canFwd,
                  style: canFwd ? toolbarBtnStyle : toolbarBtnDisabled,
                  title: "Forward",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "16px", lineHeight: 1 }, children: "▶" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "9px" }, children: "Forward" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => navigateTo(currentPage),
                  style: toolbarBtnStyle,
                  title: "Reload",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "14px", lineHeight: 1 }, children: "↺" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "9px" }, children: "Reload" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => navigateTo("home"),
                  style: toolbarBtnStyle,
                  title: "Home",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "14px", lineHeight: 1 }, children: "🏠" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "9px" }, children: "Home" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "1px", height: "32px", background: "#808080", margin: "0 4px" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "11px", whiteSpace: "nowrap", color: "#000" }, children: "Location:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: urlBar,
                  onChange: (e) => setUrlBar(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") handleGo();
                  },
                  style: {
                    flex: 1,
                    border: "2px inset #808080",
                    padding: "2px 4px",
                    fontFamily: "Courier New, monospace",
                    fontSize: "11px",
                    background: "#fff",
                    outline: "none"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleGo,
                  style: {
                    ...toolbarBtnStyle,
                    fontWeight: "bold",
                    padding: "4px 12px",
                    fontSize: "11px"
                  },
                  children: "Go!"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              height: "4px",
              background: "#c0c0c0",
              borderBottom: "1px solid #808080",
              overflow: "hidden"
            },
            children: loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  height: "100%",
                  background: "#000080",
                  animation: "ns-progress 0.18s ease-out forwards"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              flex: 1,
              overflow: "auto",
              borderTop: "2px solid #808080",
              borderLeft: "2px solid #808080",
              borderRight: "2px solid #fff",
              borderBottom: "2px solid #fff",
              margin: "2px",
              background: "#fff",
              position: "relative"
            },
            children: [
              loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    inset: 0,
                    background: "rgba(192,192,192,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    fontSize: "12px",
                    color: "#000080",
                    fontWeight: "bold"
                  },
                  children: "Loading page..."
                }
              ),
              currentPage === "home" && /* @__PURE__ */ jsxRuntimeExports.jsx(GeoHome, { navigate: navigateTo }),
              currentPage === "search" && /* @__PURE__ */ jsxRuntimeExports.jsx(SearchPage, { navigate: navigateTo }),
              currentPage === "links" && /* @__PURE__ */ jsxRuntimeExports.jsx(LinksPage, {}),
              currentPage === "portfolio" && /* @__PURE__ */ jsxRuntimeExports.jsx(PortfolioPage, {}),
              currentPage.startsWith("site:") && (() => {
                const siteId = currentPage.slice(5);
                const Renderer = RETRO_SITE_COMPONENTS[siteId];
                return Renderer ? /* @__PURE__ */ jsxRuntimeExports.jsx(Renderer, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 12 }, children: "404 — Page not found." });
              })()
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              padding: "1px 4px",
              background: "#c0c0c0",
              borderTop: "1px solid #808080",
              fontSize: "10px",
              gap: "8px",
              height: "18px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    flex: 1,
                    border: "1px inset #808080",
                    padding: "0 4px",
                    height: "14px",
                    lineHeight: "14px"
                  },
                  children: loading ? `Opening ${urlBar}…` : `Document: Done`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { border: "1px inset #808080", padding: "0 4px", height: "14px", lineHeight: "14px" }, children: "🔓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: "20px",
                    height: "14px",
                    background: "linear-gradient(135deg, #000080 50%, #000060 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    color: "#fff",
                    fontWeight: "bold",
                    fontFamily: "serif",
                    border: "1px inset #000080"
                  },
                  children: "N"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const COLS = 16;
const ROWS = 16;
const MINES = 40;
function makeBoard() {
  return Array.from(
    { length: ROWS },
    () => Array.from({ length: COLS }, () => ({ mine: false, adj: 0, state: "hidden" }))
  );
}
function neighbors(r, c) {
  const out = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
    }
  return out;
}
function plantMines(board, safeR, safeC) {
  const next = board.map((row) => row.map((c) => ({ ...c })));
  const safe = /* @__PURE__ */ new Set([
    `${safeR},${safeC}`,
    ...neighbors(safeR, safeC).map(([r, c]) => `${r},${c}`)
  ]);
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!next[r][c].mine && !safe.has(`${r},${c}`)) {
      next[r][c].mine = true;
      placed++;
    }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      next[r][c].adj = neighbors(r, c).filter(([nr, nc]) => next[nr][nc].mine).length;
  return next;
}
function floodReveal(board, r, c) {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const q = [[r, c]];
  while (q.length) {
    const [cr, cc] = q.pop();
    if (next[cr][cc].state === "revealed") continue;
    next[cr][cc].state = "revealed";
    if (next[cr][cc].adj === 0 && !next[cr][cc].mine) {
      neighbors(cr, cc).forEach(([nr, nc]) => {
        if (next[nr][nc].state === "hidden") q.push([nr, nc]);
      });
    }
  }
  return next;
}
function checkWin(board) {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell.mine && cell.state !== "revealed") return false;
    }
  return true;
}
function LCDDigits({ value, digits = 3 }) {
  const clamped = Math.max(-99, Math.min(999, value));
  const str = String(Math.abs(clamped)).padStart(digits, "0").slice(-digits);
  const display = clamped < 0 ? `-${str.slice(1)}` : str;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        background: "#000",
        color: "#f00",
        fontFamily: '"Lucida Console", "Courier New", monospace',
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "2px",
        padding: "2px 6px",
        border: "2px inset #808080",
        minWidth: `${digits * 16 + 12}px`,
        textAlign: "right",
        userSelect: "none"
      },
      children: display
    }
  );
}
const FACE = {
  idle: "🙂",
  playing: "😮",
  won: "😎",
  lost: "😵"
};
const NUM_COLORS = {
  1: "#0000ff",
  2: "#007b00",
  3: "#ff0000",
  4: "#00007b",
  5: "#7b0000",
  6: "#007b7b",
  7: "#000000",
  8: "#7b7b7b"
};
function Minesweeper() {
  const [board, setBoard] = reactExports.useState(makeBoard);
  const [phase, setPhase] = reactExports.useState("idle");
  const [flagCount, setFlagCount] = reactExports.useState(0);
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [pressing, setPressing] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => setElapsed((t) => Math.min(t + 1, 999)), 1e3);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);
  const reset = reactExports.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBoard(makeBoard());
    setPhase("idle");
    setFlagCount(0);
    setElapsed(0);
    setPressing(false);
  }, []);
  const reveal = reactExports.useCallback((r, c) => {
    setBoard((prev) => {
      const cell = prev[r][c];
      if (cell.state !== "hidden") return prev;
      let next = prev;
      if (phase === "idle") {
        next = plantMines(prev, r, c);
        setPhase("playing");
        setElapsed(0);
      }
      if (next[r][c].mine) {
        const exploded = next.map(
          (row) => row.map((cell2) => cell2.mine ? { ...cell2, state: "revealed" } : { ...cell2 })
        );
        setPhase("lost");
        if (timerRef.current) clearInterval(timerRef.current);
        return exploded;
      }
      const flooded = floodReveal(next, r, c);
      if (checkWin(flooded)) {
        setPhase("won");
        if (timerRef.current) clearInterval(timerRef.current);
      }
      return flooded;
    });
  }, [phase]);
  const flag = reactExports.useCallback((e, r, c) => {
    e.preventDefault();
    setBoard((prev) => {
      const cell = prev[r][c];
      if (cell.state === "revealed") return prev;
      const next = prev.map((row) => row.map((c2) => ({ ...c2 })));
      if (cell.state === "hidden") {
        next[r][c].state = "flagged";
        setFlagCount((f) => f + 1);
      } else if (cell.state === "flagged") {
        next[r][c].state = "question";
        setFlagCount((f) => f - 1);
      } else {
        next[r][c].state = "hidden";
      }
      return next;
    });
  }, []);
  const chord = reactExports.useCallback((r, c) => {
    setBoard((prev) => {
      const cell = prev[r][c];
      if (cell.state !== "revealed" || cell.adj === 0) return prev;
      const flagged = neighbors(r, c).filter(([nr, nc]) => prev[nr][nc].state === "flagged").length;
      if (flagged !== cell.adj) return prev;
      let next = prev;
      neighbors(r, c).forEach(([nr, nc]) => {
        if (prev[nr][nc].state === "hidden") {
          if (prev[nr][nc].mine) {
            next = next.map(
              (row) => row.map((cell2) => cell2.mine ? { ...cell2, state: "revealed" } : { ...cell2 })
            );
            setPhase("lost");
            if (timerRef.current) clearInterval(timerRef.current);
          } else {
            next = floodReveal(next, nr, nc);
          }
        }
      });
      if (checkWin(next)) {
        setPhase("won");
        if (timerRef.current) clearInterval(timerRef.current);
      }
      return next;
    });
  }, []);
  const minesLeft = MINES - flagCount;
  const faceEmoji = pressing ? "😮" : FACE[phase];
  const renderCell = (cell, r, c) => {
    const isActive = phase !== "won" && phase !== "lost";
    let content = null;
    let bg = "#c0c0c0";
    let border = "2px outset #e0e0e0";
    let cursor = isActive ? "pointer" : "default";
    if (cell.state === "revealed") {
      border = "1px solid #808080";
      bg = "#c0c0c0";
      if (cell.mine) {
        bg = phase === "lost" ? "#ff0000" : "#c0c0c0";
        content = "💣";
      } else if (cell.adj > 0) {
        content = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: NUM_COLORS[cell.adj], fontWeight: "bold", fontSize: "12px" }, children: cell.adj });
      }
    } else if (cell.state === "flagged") {
      content = "🚩";
      if (phase === "lost" && !cell.mine) content = "❌";
    } else if (cell.state === "question") {
      content = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#7b007b", fontWeight: "bold", fontSize: "12px" }, children: "?" });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "td",
      {
        onMouseDown: (e) => {
          if (!isActive || cell.state !== "hidden") return;
          if (e.button === 0) setPressing(true);
        },
        onMouseUp: (e) => {
          setPressing(false);
          if (!isActive) return;
          if (e.button === 0 && cell.state === "hidden") reveal(r, c);
          if (e.button === 1) chord(r, c);
        },
        onContextMenu: (e) => {
          if (isActive) flag(e, r, c);
        },
        onDoubleClick: () => {
          if (isActive && cell.state === "revealed") chord(r, c);
        },
        style: {
          width: 20,
          height: 20,
          minWidth: 20,
          minHeight: 20,
          border,
          background: bg,
          textAlign: "center",
          verticalAlign: "middle",
          fontSize: "11px",
          cursor,
          userSelect: "none",
          lineHeight: "18px",
          padding: 0,
          boxSizing: "border-box"
        },
        children: content
      },
      c
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6px",
        background: "#c0c0c0",
        height: "100%",
        boxSizing: "border-box",
        userSelect: "none",
        fontFamily: "MS Sans Serif, Tahoma, sans-serif",
        fontSize: "12px",
        overflow: "auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: COLS * 20 + 4,
              padding: "4px 6px",
              marginBottom: "6px",
              border: "2px inset #808080",
              background: "#c0c0c0",
              boxSizing: "border-box"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LCDDigits, { value: minesLeft }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: reset,
                  title: "New Game",
                  style: {
                    background: "#c0c0c0",
                    border: "2px outset #e0e0e0",
                    width: 28,
                    height: 28,
                    fontSize: "16px",
                    cursor: "pointer",
                    lineHeight: 1,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: faceEmoji
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(LCDDigits, { value: elapsed })
            ]
          }
        ),
        (phase === "won" || phase === "lost") && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              marginBottom: "4px",
              padding: "3px 10px",
              background: phase === "won" ? "#008000" : "#800000",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "11px",
              border: "1px solid #000"
            },
            children: phase === "won" ? "🎉 YOU WIN! Great job!" : "💥 BOOM! Game Over. Click 🙂 to retry."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              border: "3px inset #808080",
              display: "inline-block"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "table",
              {
                style: { borderCollapse: "collapse", tableLayout: "fixed" },
                onContextMenu: (e) => e.preventDefault(),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: board.map((row, r) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: row.map((cell, c) => renderCell(cell, r, c)) }, r)) })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              marginTop: "5px",
              fontSize: "10px",
              color: "#444",
              textAlign: "center",
              lineHeight: 1.5
            },
            children: [
              "Left-click to reveal · Right-click to flag 🚩 · Double-click to chord",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              MINES,
              " mines · ",
              ROWS,
              "×",
              COLS,
              " · Classic Expert Mode"
            ]
          }
        )
      ]
    }
  );
}
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
];
function useKonamiCode(onSuccess) {
  const idxRef = reactExports.useRef(0);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const expected = KONAMI[idxRef.current];
      const pressed = e.key;
      if (pressed === expected) {
        idxRef.current += 1;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          idxRef.current = 0;
        }, 2e3);
        if (idxRef.current === KONAMI.length) {
          idxRef.current = 0;
          if (timerRef.current) clearTimeout(timerRef.current);
          onSuccess();
        }
      } else {
        idxRef.current = pressed === KONAMI[0] ? 1 : 0;
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onSuccess]);
}
const POST_LINES = [
  "WEBCORE BIOS v2.01 (C) 1998 WebCore Technologies",
  "CPU: PENTIUM II 333MHz",
  "Detecting RAM............ 64MB OK",
  "Detecting HDD........... Quantum Fireball 4.3GB OK",
  "Detecting CD-ROM........ CREATIVE 52X OK",
  "Initializing PCI Bus......",
  "PCI Device: VGA Compatible Controller",
  "PCI Device: Ethernet Controller [NE2000]",
  "PCI Device: Sound Blaster 16 AWE",
  "Checking NVRAM .......... OK",
  "Loading WEBCORE98.......",
  "",
  "Starting WEBCORE98...",
  "  Loading HIMEM.SYS",
  "  Loading EMM386.EXE",
  "  Loading MOUSE.COM",
  "  Loading SMARTDRV.EXE",
  "",
  "WEBCORE98 Version 4.10.1998",
  "Copyright (C) WebCore Corp 1981-1998",
  "",
  "Loading desktop environment..."
];
const BOOT_BAR_LABEL = "WEBCORE98";
const BSOD_LINES = [
  "A fatal exception 0E has occurred at 0028:C0011E36 in VxD WEBCORE(01) +",
  "00010E36. The current application will be terminated.",
  "",
  "  * Press any key to terminate the current application.",
  "  * Press CTRL+ALT+DEL to restart your computer. You will",
  "    lose any unsaved information in all applications.",
  "",
  "Press any key to continue _"
];
function BSODSystem({ children, errorCode, onRegister }) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [postLines, setPostLines] = reactExports.useState([]);
  const [bootPct, setBootPct] = reactExports.useState(0);
  const [desktopOpacity, setDesktopOpacity] = reactExports.useState(1);
  const lineTimersRef = reactExports.useRef([]);
  const code = errorCode ?? "FATAL_ERROR: DESIGN_TOO_GOOD";
  const trigger = reactExports.useCallback(() => {
    setPhase("bsod");
    setDesktopOpacity(0);
  }, []);
  reactExports.useEffect(() => {
    onRegister(trigger);
  }, [onRegister, trigger]);
  reactExports.useEffect(() => {
    if (phase !== "bsod") return;
    const onKey = () => startPost();
    const onClick = () => startPost();
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [phase]);
  const startPost = reactExports.useCallback(() => {
    setPhase("post");
    setPostLines([]);
    lineTimersRef.current.forEach(clearTimeout);
    lineTimersRef.current = [];
    POST_LINES.forEach((line, i) => {
      const t2 = setTimeout(() => {
        setPostLines((prev) => [...prev, line]);
      }, i * 120);
      lineTimersRef.current.push(t2);
    });
    const totalDelay = POST_LINES.length * 120 + 200;
    const t = setTimeout(() => {
      setPhase("booting");
      setBootPct(0);
    }, totalDelay);
    lineTimersRef.current.push(t);
  }, []);
  reactExports.useEffect(() => {
    if (phase !== "booting") return;
    const steps = 30;
    const interval = 60;
    let tick = 0;
    const id = setInterval(() => {
      tick++;
      setBootPct(Math.min(100, Math.round(tick / steps * 100)));
      if (tick >= steps) {
        clearInterval(id);
        setTimeout(() => {
          setDesktopOpacity(1);
          setTimeout(() => {
            setPhase("idle");
            setPostLines([]);
            setBootPct(0);
          }, 600);
        }, 300);
      }
    }, interval);
    return () => clearInterval(id);
  }, [phase]);
  const isOverlay = phase !== "idle";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          opacity: desktopOpacity,
          transition: desktopOpacity === 1 ? "opacity 0.6s ease-in" : "opacity 0s",
          pointerEvents: isOverlay ? "none" : "auto"
        },
        children
      }
    ),
    phase === "bsod" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          background: "#0000aa",
          color: "#fff",
          fontFamily: "'Lucida Console', 'Courier New', monospace",
          fontSize: "clamp(11px, 1.4vw, 15px)",
          lineHeight: 1.55,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 60px",
          boxSizing: "border-box",
          userSelect: "none",
          animation: "bsodFadeIn 0.1s steps(1) forwards"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                background: "#aaaaaa",
                color: "#0000aa",
                padding: "4px 12px",
                fontSize: "clamp(13px, 1.8vw, 18px)",
                fontWeight: "bold",
                marginBottom: "24px",
                letterSpacing: "0.05em",
                textAlign: "center"
              },
              children: "Windows"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: "clamp(12px, 1.6vw, 16px)",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "20px",
                letterSpacing: "0.02em",
                textAlign: "center"
              },
              children: code
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxWidth: "640px", textAlign: "left" }, children: BSOD_LINES.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: line === "" ? "8px" : "2px" }, children: line || " " }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                marginTop: "32px",
                fontSize: "clamp(10px, 1.2vw, 13px)",
                color: "#aaaaff",
                animation: "bsodBlink 1s steps(2) infinite"
              },
              children: "▌ Click anywhere or press any key to reboot..."
            }
          )
        ]
      }
    ),
    (phase === "post" || phase === "booting") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          background: "#000",
          color: "#aaa",
          fontFamily: "'Lucida Console', 'Courier New', monospace",
          fontSize: "clamp(10px, 1.3vw, 13px)",
          lineHeight: 1.55,
          padding: "24px 32px",
          boxSizing: "border-box",
          userSelect: "none",
          overflowY: "hidden"
        },
        children: [
          phase === "post" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            postLines.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: line.startsWith("  ") ? "#888" : "#aaa" }, children: line || " " }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { animation: "bsodBlink 0.6s steps(2) infinite", color: "#aaa" }, children: "_" })
          ] }),
          phase === "booting" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      fontSize: "clamp(22px, 4vw, 40px)",
                      fontWeight: "bold",
                      color: "#fff",
                      letterSpacing: "0.15em",
                      fontFamily: "serif"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#0000ff" }, children: "Web" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff" }, children: "core" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("sup", { style: { fontSize: "0.4em", color: "#aaa", marginLeft: "2px" }, children: "98" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#888", fontSize: "clamp(9px, 1.1vw, 12px)", letterSpacing: "0.08em" }, children: [
                  "Starting ",
                  BOOT_BAR_LABEL,
                  "..."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: "clamp(200px, 40vw, 320px)",
                      height: "18px",
                      border: "2px solid #555",
                      background: "#111",
                      overflow: "hidden",
                      display: "flex",
                      gap: "2px",
                      padding: "2px",
                      boxSizing: "border-box"
                    },
                    children: Array.from({ length: 20 }).map((_, i) => {
                      const filled = i < Math.round(bootPct / 100 * 20);
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            flex: 1,
                            background: filled ? "#0000cc" : "transparent",
                            transition: "background 0.05s"
                          }
                        },
                        i
                      );
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", fontSize: "clamp(9px, 1vw, 11px)" }, children: [
                  bootPct,
                  "%"
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function FileExplorer({
  currentPath,
  onNavigate,
  files,
  onDeleteFile,
  onOpenFile
}) {
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [contextMenu, setContextMenu] = reactExports.useState(null);
  const containerRef = reactExports.useRef(null);
  const pathString = currentPath.join("\\");
  const currentItems = files[pathString] || [];
  reactExports.useEffect(() => {
    const handleOutside = (e) => {
      if (contextMenu && !e.target.closest(".context-menu")) {
        setContextMenu(null);
      }
    };
    window.addEventListener("mousedown", handleOutside);
    return () => window.removeEventListener("mousedown", handleOutside);
  }, [contextMenu]);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedFile) {
        onDeleteFile(currentPath, selectedFile);
        setSelectedFile(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFile, currentPath, onDeleteFile]);
  const handleBack = () => {
    if (currentPath.length > 1) {
      const next = [...currentPath];
      next.pop();
      onNavigate(next);
      setSelectedFile(null);
    }
  };
  const handleDoubleClick = (file) => {
    if (file.type === "folder") {
      onNavigate([...currentPath, file.name]);
      setSelectedFile(null);
    } else {
      onOpenFile(file);
    }
  };
  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setSelectedFile(file);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      file
    });
  };
  const getIcon = (type) => {
    switch (type) {
      case "folder":
        return "📁";
      case "txt":
        return "📄";
      case "bmp":
        return "🎨";
      case "dll":
        return "⚙️";
      case "lnk":
        return "shortcut 🔗";
      case "ini":
        return "⚙️";
      default:
        return "📄";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: "flex flex-col h-full bg-window text-[11px] font-sans relative",
      onClick: () => setSelectedFile(null),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 p-1 border-b border-[color:var(--border-dark)] bg-window select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleBack,
              disabled: currentPath.length <= 1,
              className: "win-btn flex items-center gap-0.5 px-2 py-0.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⬅️" }),
                " Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleBack,
              disabled: currentPath.length <= 1,
              className: "win-btn flex items-center gap-0.5 px-2 py-0.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⬆️" }),
                " Up"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-gray-400 mx-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700", children: "Address:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: pathString,
              readOnly: true,
              className: "flex-1 bevel-thin-in px-1 bg-white text-black outline-none h-[20px]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto bg-white p-2 select-none", children: currentItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-center py-8", children: "This folder is empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-3", children: currentItems.map((file) => {
          const isSelected = selectedFile?.name === file.name;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onDoubleClick: () => handleDoubleClick(file),
              onClick: (e) => {
                e.stopPropagation();
                setSelectedFile(file);
              },
              onContextMenu: (e) => handleContextMenu(e, file),
              className: `flex flex-col items-center p-1 cursor-default text-center rounded border border-transparent ${isSelected ? "bg-titlebar text-titlebar-foreground border-dotted border-gray-400" : "hover:bg-gray-100"}`,
              style: { minWidth: "60px" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-1 leading-none", children: getIcon(file.type) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "break-all leading-tight text-[11px] px-0.5", children: file.name })
              ]
            },
            file.name
          );
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-[color:var(--border-dark)] bg-window p-1 flex justify-between select-none text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            currentItems.length,
            " object(s)"
          ] }),
          selectedFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            "Selected: ",
            selectedFile.name,
            " (",
            selectedFile.size || "Unknown size",
            ")"
          ] })
        ] }),
        contextMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "context-menu absolute bevel-out bg-window p-0.5 z-[9999] shadow-md flex flex-col w-28",
            style: { top: contextMenu.y - 40, left: contextMenu.x - 20 },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    handleDoubleClick(contextMenu.file);
                    setContextMenu(null);
                  },
                  className: "text-left px-2 py-0.5 hover:bg-titlebar hover:text-titlebar-foreground w-full",
                  children: "Open"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    onDeleteFile(currentPath, contextMenu.file);
                    setContextMenu(null);
                    setSelectedFile(null);
                  },
                  className: "text-left px-2 py-0.5 hover:bg-titlebar hover:text-titlebar-foreground w-full",
                  children: "Delete"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-gray-400 my-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    alert(
                      `Properties of ${contextMenu.file.name}:
Type: ${contextMenu.file.type.toUpperCase()} File
Size: ${contextMenu.file.size || "Unknown"}`
                    );
                    setContextMenu(null);
                  },
                  className: "text-left px-2 py-0.5 hover:bg-titlebar hover:text-titlebar-foreground w-full",
                  children: "Properties"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const RETRO_PLAYLIST = [
  {
    title: "1. DJ Snacky - Cyber Chiptune Loop.mp3",
    duration: "0:30",
    notes: [
      { note: 60, dur: 0.2 },
      { note: 63, dur: 0.2 },
      { note: 67, dur: 0.2 },
      { note: 72, dur: 0.2 },
      { note: 70, dur: 0.2 },
      { note: 67, dur: 0.2 },
      { note: 65, dur: 0.2 },
      { note: 67, dur: 0.2 },
      { note: 58, dur: 0.2 },
      { note: 62, dur: 0.2 },
      { note: 65, dur: 0.2 },
      { note: 70, dur: 0.2 },
      { note: 67, dur: 0.2 },
      { note: 65, dur: 0.2 },
      { note: 62, dur: 0.2 },
      { note: 65, dur: 0.2 }
    ]
  },
  {
    title: "2. MC Webcore - Y2K Millennium.mp3",
    duration: "0:25",
    notes: [
      { note: 50, dur: 0.15 },
      { note: 50, dur: 0.15 },
      { note: 62, dur: 0.15 },
      { note: 50, dur: 0.15 },
      { note: 55, dur: 0.15 },
      { note: 50, dur: 0.15 },
      { note: 58, dur: 0.15 },
      { note: 57, dur: 0.3 },
      { note: 50, dur: 0.15 },
      { note: 50, dur: 0.15 },
      { note: 62, dur: 0.15 },
      { note: 50, dur: 0.15 },
      { note: 55, dur: 0.15 },
      { note: 50, dur: 0.15 },
      { note: 60, dur: 0.3 }
    ]
  },
  {
    title: "3. Retro System - kernel32 Panic.mp3",
    duration: "0:20",
    notes: [
      { note: 72, dur: 0.1 },
      { note: 71, dur: 0.1 },
      { note: 69, dur: 0.1 },
      { note: 67, dur: 0.1 },
      { note: 65, dur: 0.1 },
      { note: 64, dur: 0.1 },
      { note: 62, dur: 0.1 },
      { note: 60, dur: 0.3 },
      { note: 67, dur: 0.2 },
      { note: 67, dur: 0.2 },
      { note: 69, dur: 0.2 },
      { note: 67, dur: 0.4 }
    ]
  }
];
function Winamp() {
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = reactExports.useState(0);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  const [volume, setVolume] = reactExports.useState(70);
  const [balance, setBalance] = reactExports.useState(0);
  const [eqSliders, setEqSliders] = reactExports.useState([50, 40, 60, 70, 50]);
  const canvasRef = reactExports.useRef(null);
  const marqueeRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const synthIntervalRef = reactExports.useRef(null);
  reactExports.useRef(null);
  const playTimeIntervalRef = reactExports.useRef(null);
  const activeOscillatorsRef = reactExports.useRef([]);
  const currentTrack = RETRO_PLAYLIST[currentTrackIdx];
  const mtof = (note) => Math.pow(2, (note - 69) / 12) * 440;
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };
  const startSynth = () => {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    let noteIdx = 0;
    const playNextNote = () => {
      const track = RETRO_PLAYLIST[currentTrackIdx];
      const noteData = track.notes[noteIdx];
      if (!noteData) {
        noteIdx = 0;
        return;
      }
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(mtof(noteData.note), ctx.currentTime);
      const baseVol = volume / 100 * 0.15;
      gainNode.gain.setValueAtTime(baseVol, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + noteData.dur - 0.02);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + noteData.dur);
      activeOscillatorsRef.current.push(osc);
      setTimeout(() => {
        activeOscillatorsRef.current = activeOscillatorsRef.current.filter((o) => o !== osc);
      }, noteData.dur * 1e3);
      noteIdx = (noteIdx + 1) % track.notes.length;
      synthIntervalRef.current = window.setTimeout(playNextNote, noteData.dur * 1e3);
    };
    playNextNote();
    playTimeIntervalRef.current = window.setInterval(() => {
      setCurrentTime((t) => t + 1);
    }, 1e3);
  };
  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (playTimeIntervalRef.current) {
      clearInterval(playTimeIntervalRef.current);
      playTimeIntervalRef.current = null;
    }
    activeOscillatorsRef.current.forEach((o) => {
      try {
        o.stop();
      } catch (e) {
      }
    });
    activeOscillatorsRef.current = [];
  };
  const handlePlay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    startSynth();
  };
  const handlePause = () => {
    setIsPlaying(false);
    stopSynth();
  };
  const handleStop = () => {
    setIsPlaying(false);
    stopSynth();
    setCurrentTime(0);
  };
  const handleNext = () => {
    const wasPlaying = isPlaying;
    handleStop();
    setCurrentTrackIdx((currentTrackIdx + 1) % RETRO_PLAYLIST.length);
    if (wasPlaying) {
      setTimeout(() => {
        setIsPlaying(true);
        startSynth();
      }, 50);
    }
  };
  const handlePrev = () => {
    const wasPlaying = isPlaying;
    handleStop();
    setCurrentTrackIdx((currentTrackIdx - 1 + RETRO_PLAYLIST.length) % RETRO_PLAYLIST.length);
    if (wasPlaying) {
      setTimeout(() => {
        setIsPlaying(true);
        startSynth();
      }, 50);
    }
  };
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame;
    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (isPlaying) {
        ctx.fillStyle = "#00ff00";
        const numBars = 16;
        const barWidth = Math.floor(canvas.width / numBars) - 1;
        for (let i = 0; i < numBars; i++) {
          const timeFactor = Date.now() * 5e-3;
          const heightFactor = Math.sin(timeFactor + i) * 0.5 + 0.5;
          const barHeight = Math.max(2, heightFactor * (canvas.height - 4));
          const x = i * (barWidth + 1);
          const y = canvas.height - barHeight;
          if (barHeight > canvas.height * 0.7) {
            ctx.fillStyle = "#ff0000";
          } else if (barHeight > canvas.height * 0.4) {
            ctx.fillStyle = "#ffff00";
          } else {
            ctx.fillStyle = "#00ff00";
          }
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        ctx.strokeStyle = "#005500";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
      animFrame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);
  reactExports.useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col bg-black text-[#00ff00] font-mono select-none p-1.5 border border-[#333] shadow-lg rounded", style: { width: "275px", fontFamily: "'Courier New', Courier, monospace" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-2 rounded flex flex-col gap-1.5", style: {
      background: "linear-gradient(180deg, #333 0%, #111 100%)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#050505] text-[#00ff00] h-6 flex items-center overflow-hidden border border-[#222] px-1 rounded relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: marqueeRef, className: `whitespace-nowrap text-xs ${isPlaying ? "animate-[marquee_12s_linear_infinite]" : ""}`, children: [
        currentTrack.title,
        " *** WINAMP 2.81 *** WINAMP 2.81 ***"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center gap-1 bg-black p-1 border border-[#222] rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold tracking-widest text-[#ffcc00] px-1", children: formatTime(currentTime) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-[#888] flex flex-col text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "kbps: 128" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "kHz: 44" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black border border-[#222] rounded h-10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, width: 250, height: 40, className: "w-full h-full" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-[10px] text-[#ccc] items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "VOL: ",
            volume,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: "100",
              value: volume,
              onChange: (e) => setVolume(Number(e.target.value)),
              className: "accent-[#00ff00] bg-[#222] h-1.5 rounded cursor-pointer"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "BAL: ",
            balance === 0 ? "CENTER" : balance > 0 ? `R:${balance}` : `L:${Math.abs(balance)}`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: "-50",
              max: "50",
              value: balance,
              onChange: (e) => setBalance(Number(e.target.value)),
              className: "accent-[#00ff00] bg-[#222] h-1.5 rounded cursor-pointer"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-1.5 mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handlePrev, className: "px-2 py-1 text-xs rounded bg-[#444] border border-[#222] text-[#fff] active:bg-[#222] active:text-[#00ff00] shadow", children: "|<<" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handlePlay, className: `px-2.5 py-1 text-xs rounded border border-[#222] shadow ${isPlaying ? "bg-[#00ff00] text-black" : "bg-[#444] text-[#fff] active:bg-[#222] active:text-[#00ff00]"}`, children: "▶" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handlePause, className: `px-2.5 py-1 text-xs rounded border border-[#222] shadow ${!isPlaying && currentTime > 0 ? "bg-[#ffcc00] text-black" : "bg-[#444] text-[#fff] active:bg-[#222] active:text-[#00ff00]"}`, children: "||" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleStop, className: "px-2.5 py-1 text-xs rounded bg-[#444] border border-[#222] text-[#fff] active:bg-[#222] active:text-[#ff0000] shadow", children: "■" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleNext, className: "px-2 py-1 text-xs rounded bg-[#444] border border-[#222] text-[#fff] active:bg-[#222] active:text-[#00ff00] shadow", children: ">>|" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 bg-[#111] border border-[#222] rounded p-1 text-[11px] text-[#888] flex flex-col gap-1 max-h-24 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-[#ccc] border-b border-[#222] pb-0.5 mb-1 font-bold", children: "PLAYLIST" }),
      RETRO_PLAYLIST.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => {
            handleStop();
            setCurrentTrackIdx(i);
          },
          className: `cursor-pointer px-1 py-0.5 rounded flex justify-between ${i === currentTrackIdx ? "text-[#00ff00] bg-[#222]" : "hover:text-[#fff]"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: t.title.split(" - ")[1] || t.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.duration })
          ]
        },
        i
      ))
    ] })
  ] });
}
const INITIAL_CONTACTS = [
  {
    id: "webmistress",
    name: "webmistress_98",
    status: "online",
    avatar: "👩‍💻",
    replies: [
      "Hey! Love your retro setup. Did you check out my guestbook page?",
      "I'm updating my Geocities home page right now, adding some blinking banners!",
      "Awesome case studies in your File Explorer. The Webcore 98 layout is so neat."
    ]
  },
  {
    id: "coolkid",
    name: "xXcoolKid99Xx",
    status: "away",
    avatar: "🛹",
    replies: [
      "dude, i'm playing doom, hang on",
      "first entry on guestbook represent! B-)",
      "let me check the case studies later, busy downloading an MP3 on Napster"
    ]
  },
  {
    id: "dialupdan",
    name: "DialUpDan",
    status: "online",
    avatar: "🔌",
    replies: [
      "hey! wait, someone is picking up the house phone... *static noise*",
      "lost connection... dial-up disconnected...",
      "welcome back, connection speed 28.8 Kbps"
    ]
  },
  {
    id: "clippy",
    name: "Clippy (Helper)",
    status: "online",
    avatar: "📎",
    replies: [
      "It looks like you are trying to view this portfolio. Would you like some help?",
      "Tip: Double-clicking kernel32.dll in System32 could melt your screen. Or cause a BSOD!",
      "I can assist you in writing a guestbook entry or choosing a track on Winamp."
    ]
  }
];
function ICQ() {
  const [contacts, setContacts] = reactExports.useState(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = reactExports.useState(null);
  const [chatLogs, setChatLogs] = reactExports.useState({});
  const [inputText, setInputText] = reactExports.useState("");
  const chatEndRef = reactExports.useRef(null);
  const activeContact = contacts.find((c) => c.id === activeContactId);
  const messages = activeContactId ? chatLogs[activeContactId] || [] : [];
  reactExports.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const playUhOhSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(950, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(1e-3, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1050, now + 0.08);
      gain2.gain.setValueAtTime(0.08, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(1e-3, now + 0.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.2);
    } catch (e) {
      console.warn("Failed to play ICQ alert sound:", e);
    }
  };
  const handleSendMessage = () => {
    if (!inputText.trim() || !activeContactId) return;
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { sender: "You", text: inputText, time };
    setChatLogs((logs) => ({
      ...logs,
      [activeContactId]: [...logs[activeContactId] || [], userMsg]
    }));
    setInputText("");
    const contact = activeContact;
    setTimeout(() => {
      const replyText = contact.replies[Math.floor(Math.random() * contact.replies.length)];
      const replyMsg = { sender: contact.name, text: replyText, time };
      setChatLogs((logs) => ({
        ...logs,
        [activeContactId]: [...logs[activeContactId] || [], replyMsg]
      }));
      playUhOhSound();
    }, 1200);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full bg-window text-[11px] font-pixel select-none overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-44 border-r border-[color:var(--border-dark)] flex flex-col h-full bg-white select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-titlebar text-titlebar-foreground px-2 py-1 flex items-center justify-between text-[10px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ICQ #99187315" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🟢 Online" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-1.5 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[10px] text-gray-500 uppercase tracking-wider mb-1", children: "Contacts" }),
        contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveContactId(c.id),
            className: `flex items-center gap-2 w-full text-left p-1 rounded ${activeContactId === c.id ? "bg-titlebar text-titlebar-foreground" : "hover:bg-gray-100"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.avatar }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: c.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-2 h-2 rounded-full ${getStatusColor(c.status)}` })
            ]
          },
          c.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col h-full bg-window", children: activeContact ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1.5 bg-[color:var(--muted)] border-b border-[color:var(--border-dark)] font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: activeContact.avatar }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Chatting with ",
          activeContact.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto bg-white p-2 space-y-2", children: [
        messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-center py-4", children: "Send a message to start chatting!" }),
        messages.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col ${m.sender === "You" ? "items-end" : "items-start"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-gray-500 font-bold mb-0.5", children: [
            m.sender,
            " - ",
            m.time
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-1.5 rounded-lg max-w-[85%] border shadow-sm ${m.sender === "You" ? "bg-titlebar text-titlebar-foreground border-blue-800" : "bg-gray-200 text-black border-gray-300"}`, children: m.text })
        ] }, idx)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: chatEndRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1.5 border-t border-[color:var(--border-dark)] flex gap-1 bg-window", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: inputText,
            onChange: (e) => setInputText(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") handleSendMessage();
            },
            placeholder: "Type a message...",
            className: "flex-1 bevel-thin-in px-1 bg-white text-black outline-none h-6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSendMessage, className: "win-btn px-3 h-6", children: "Send" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center flex-1 text-gray-500 p-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "🌸" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "Welcome to ICQ Chat" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] mt-1", children: "Select a contact from the left list to begin messaging." })
    ] }) })
  ] });
}
const INITIAL_FILES = {
  "C:": [{
    name: "My Documents",
    type: "folder"
  }, {
    name: "Program Files",
    type: "folder"
  }, {
    name: "Windows",
    type: "folder"
  }],
  "C:\\My Documents": [{
    name: "Case Studies",
    type: "folder"
  }, {
    name: "Downloads",
    type: "folder"
  }, {
    name: "Media",
    type: "folder"
  }],
  "C:\\My Documents\\Case Studies": [{
    name: "Webcore98.txt",
    type: "txt",
    size: "2.4 KB",
    content: "CASE STUDY: WEBCORE 98 DESKTOP SYSTEM\n\n- Overview: A high-fidelity retro Windows 98 operating system environment implemented entirely in React and styled with 98.css.\n- Technical Stack: React 18, drag-and-drop window position management, standard layering z-index sorting.\n- UX Elements: Authentic mouse double-click responses, marquee titles, taskbars, live task button switching, and interactive accessories like Calculator and Paint."
  }, {
    name: "Search98.txt",
    type: "txt",
    size: "3.1 KB",
    content: "CASE STUDY: SEARCH98 ENGINE & RETRO SITES\n\n- Overview: An index of replica 1998 websites (Yahoo Finance, WebMuseum Paris, Slashdot, GameFAQs, WebMD, Amazon, MoveOn, Nupedia, BBC, etc.) rendered as internal React layouts.\n- Mechanics: The user submits topics in Search98. The engine performs a search index query matching and returns mock period-accurate results.\n- Dynamic Viewport: Web site results load within the Netscape Navigator window's custom frame, featuring a functioning browser address bar and history navigation."
  }, {
    name: "BSOD_Handler.txt",
    type: "txt",
    size: "1.8 KB",
    content: "CASE STUDY: SYSTEM ERROR CAPTURE SYSTEM (BSOD)\n\n- Overview: A custom crash handler that intercept errors or can be manually invoked via System32 or net errors.\n- Design: Full-screen 4:3 console format rendering high-fidelity white-on-blue text with retro fonts, complete with press-any-key listener loops that trigger soft system reboots back into the workspace."
  }],
  "C:\\My Documents\\Downloads": [{
    name: "icq_setup.exe",
    type: "lnk",
    size: "4.8 MB"
  }, {
    name: "aol_setup.exe",
    type: "lnk",
    size: "9.2 MB"
  }],
  "C:\\My Documents\\Media": [{
    name: "construction.bmp",
    type: "bmp",
    size: "64 KB",
    content: "/under_construction.png"
  }, {
    name: "badges.bmp",
    type: "bmp",
    size: "128 KB",
    content: "/web_badges.png"
  }],
  "C:\\Program Files": [{
    name: "Games",
    type: "folder"
  }],
  "C:\\Program Files\\Games": [{
    name: "clippy.dll",
    type: "dll",
    size: "45 KB"
  }, {
    name: "minesweeper.lnk",
    type: "lnk",
    size: "1.2 KB"
  }],
  "C:\\Windows": [{
    name: "System32",
    type: "folder"
  }],
  "C:\\Windows\\System32": [{
    name: "kernel32.dll",
    type: "dll",
    size: "320 KB"
  }, {
    name: "user32.dll",
    type: "dll",
    size: "180 KB"
  }, {
    name: "win.ini",
    type: "ini",
    size: "4.1 KB",
    content: "[windows]\nload=\nrun=\nNullPort=None\ndevice=HP LaserJet\n\n[Desktop]\nWallpaper=none\nPattern=none\n\n[Clippy]\nAdviceEnabled=1\nNostalgiaScale=10"
  }]
};
function Desktop() {
  const [windows, setWindows] = reactExports.useState([]);
  const [activeId, setActiveId] = reactExports.useState(null);
  const [startOpen, setStartOpen] = reactExports.useState(false);
  const [clock, setClock] = reactExports.useState("");
  const [konamiToast, setKonamiToast] = reactExports.useState(false);
  const [minesUnlocked, setMinesUnlocked] = reactExports.useState(false);
  const [fsFiles, setFsFiles] = reactExports.useState(INITIAL_FILES);
  const [explorerPath, setExplorerPath] = reactExports.useState(["C:"]);
  const [recycleBin, setRecycleBin] = reactExports.useState([]);
  const [viewerImgUrl, setViewerImgUrl] = reactExports.useState(null);
  const [notepadText, setNotepadText] = reactExports.useState("");
  const [aolDialing, setAolDialing] = reactExports.useState(false);
  const [aolStatus, setAolStatus] = reactExports.useState("");
  const [clippyVisible, setClippyVisible] = reactExports.useState(false);
  const [clippyMessage, setClippyMessage] = reactExports.useState("");
  const [emptyingProgress, setEmptyingProgress] = reactExports.useState(null);
  const zRef = reactExports.useRef(10);
  const openedOnce = reactExports.useRef(false);
  const toastTimerRef = reactExports.useRef(null);
  const triggerBSOD = reactExports.useRef(null);
  const registerCrash = reactExports.useCallback((fn) => {
    triggerBSOD.current = fn;
  }, []);
  const crash = reactExports.useCallback(() => triggerBSOD.current?.(), []);
  const clippyTips = ["It looks like you are trying to view this portfolio. Would you like some help?", "Did you know? Double-clicking kernel32.dll in System32 triggers a BSOD!", "Tip: You can press the DELETE key to send files directly to the Recycle Bin.", "Make sure to sign the Guestbook before you leave!", "Try entering the Konami Code (Up Up Down Down...) to unlock Minesweeper!", "Winamp is perfect for playing chiptunes in the background."];
  const triggerClippyTip = () => {
    setClippyMessage(clippyTips[Math.floor(Math.random() * clippyTips.length)]);
  };
  reactExports.useEffect(() => {
    const t = setInterval(() => {
      const d = /* @__PURE__ */ new Date();
      setClock(d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }));
    }, 1e3);
    return () => clearInterval(t);
  }, []);
  const onKonami = reactExports.useCallback(() => {
    setKonamiToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setKonamiToast(false), 2800);
    setMinesUnlocked(true);
    setTimeout(() => openApp("mines"), 400);
  }, []);
  useKonamiCode(onKonami);
  const playTrashSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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
    } catch (e) {
    }
  };
  const playEmptyTrashSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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
    } catch (e) {
    }
  };
  const playAolModemSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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
      gainDial.gain.exponentialRampToValueAtTime(1e-3, now + 0.6);
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
        dGain.gain.exponentialRampToValueAtTime(1e-3, dNow + 0.1);
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
      filter.frequency.setValueAtTime(1e3, hNow);
      filter.frequency.linearRampToValueAtTime(300, hNow + 0.5);
      filter.frequency.linearRampToValueAtTime(2e3, hNow + 1.2);
      filter.Q.setValueAtTime(3, hNow);
      const gainH = ctx.createGain();
      gainH.gain.setValueAtTime(0.06, hNow);
      gainH.gain.exponentialRampToValueAtTime(1e-3, hNow + 1.5);
      noise.connect(filter);
      filter.connect(gainH);
      gainH.connect(ctx.destination);
      noise.start(hNow);
    } catch (e) {
    }
  };
  const handleDeleteFile = (path, file) => {
    if (confirm(`Are you sure you want to send '${file.name}' to the Recycle Bin?`)) {
      const pathStr = path.join("\\");
      setFsFiles((prev) => ({
        ...prev,
        [pathStr]: prev[pathStr].filter((item) => item.name !== file.name)
      }));
      const deletedItem = {
        ...file,
        originalPath: pathStr,
        dateDeleted: (/* @__PURE__ */ new Date()).toLocaleString()
      };
      setRecycleBin((prev) => [...prev, deletedItem]);
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
  const handleOpenFile = (file) => {
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
  const APPS = reactExports.useMemo(() => [{
    id: "browser",
    title: "Netscape Navigator",
    icon: "🌐",
    width: 660,
    height: 520,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(NetscapeNavigator, {})
  }, {
    id: "about",
    title: "Welcome.htm — Netscape",
    icon: "📄",
    width: 460,
    height: 420,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(AboutMe, {})
  }, {
    id: "notepad",
    title: "Untitled — Notepad",
    icon: "📝",
    width: 420,
    height: 320,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Notepad, { text: notepadText, onChange: setNotepadText })
  }, {
    id: "calc",
    title: "Calculator",
    icon: "🧮",
    width: 220,
    height: 280,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, {})
  }, {
    id: "paint",
    title: "untitled — Paint",
    icon: "🎨",
    width: 520,
    height: 440,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Paint, {})
  }, {
    id: "guestbook",
    title: "Guestbook.exe",
    icon: "📖",
    width: 380,
    height: 420,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Guestbook, {})
  }, {
    id: "terminal",
    title: "MS-DOS Prompt",
    icon: "💻",
    width: 460,
    height: 320,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, {})
  }, {
    id: "mines",
    title: "Minesweeper",
    icon: "💣",
    width: 360,
    height: 430,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Minesweeper, {})
  }, {
    id: "explorer",
    title: "My Computer",
    icon: "📁",
    width: 520,
    height: 380,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(FileExplorer, { currentPath: explorerPath, onNavigate: setExplorerPath, files: fsFiles, onDeleteFile: handleDeleteFile, onOpenFile: handleOpenFile })
  }, {
    id: "winamp",
    title: "Winamp 2.81",
    icon: "📻",
    width: 290,
    height: 380,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(Winamp, {})
  }, {
    id: "icq",
    title: "ICQ - 99187315",
    icon: "🌸",
    width: 440,
    height: 400,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(ICQ, {})
  }, {
    id: "imageviewer",
    title: "Image Preview",
    icon: "🎨",
    width: 380,
    height: 340,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center p-4 bg-window h-full", children: viewerImgUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: viewerImgUrl, alt: "Preview", className: "max-w-full max-h-full bevel-thin-in bg-white", style: {
      imageRendering: "pixelated"
    } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "No Image Loaded" }) })
  }, {
    id: "recycle",
    title: "Recycle Bin",
    icon: recycleBin.length > 0 ? "🗑️📄" : "🗑️",
    width: 480,
    height: 340,
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-window text-[11px] font-sans", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 p-1 border-b border-[color:var(--border-dark)] select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleEmptyRecycleBin, disabled: recycleBin.length === 0, className: "win-btn px-2 py-0.5 font-bold", children: "Empty Recycle Bin" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto bg-white p-1 select-none", children: recycleBin.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-center py-12", children: "Recycle Bin is empty." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-200 border-b border-gray-400 font-bold text-gray-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-1 border-r border-gray-300", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-1 border-r border-gray-300", children: "Original Path" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-1 border-r border-gray-300", children: "Date Deleted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-1", children: "Size" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recycleBin.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-gray-100 border-b border-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.type === "folder" ? "📁" : "📄" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-1 text-gray-600", children: item.originalPath }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-1 text-gray-500 text-[10px]", children: item.dateDeleted }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-1 text-gray-600", children: item.size || "1 KB" })
        ] }, idx)) })
      ] }) })
    ] })
  }], [explorerPath, fsFiles, recycleBin, viewerImgUrl, notepadText]);
  const openApp = (id) => {
    setStartOpen(false);
    const app = APPS.find((a) => a.id === id);
    if (!app) return;
    setWindows((ws) => {
      const existing = ws.find((w) => w.id === id);
      if (existing) {
        zRef.current += 1;
        return ws.map((w) => w.id === id ? {
          ...w,
          minimized: false,
          z: zRef.current
        } : w);
      }
      zRef.current += 1;
      const offset = ws.length * 24;
      return [...ws, {
        id,
        title: app.title,
        icon: app.icon,
        x: 60 + offset,
        y: 40 + offset,
        width: app.width,
        height: app.height,
        z: zRef.current,
        minimized: false,
        maximized: false
      }];
    });
    setActiveId(id);
  };
  reactExports.useEffect(() => {
    if (openedOnce.current) return;
    openedOnce.current = true;
    openApp("browser");
  }, []);
  const closeWin = (id) => {
    const closedApp = APPS.find((a) => a.id === id);
    if (closedApp && id !== "recycle") {
      const shortcutItem = {
        name: `${closedApp.title.split(" — ")[0]}.lnk`,
        type: "lnk",
        size: "1.0 KB",
        originalPath: "Desktop",
        dateDeleted: (/* @__PURE__ */ new Date()).toLocaleString()
      };
      setRecycleBin((prev) => {
        if (prev.some((item) => item.name === shortcutItem.name)) return prev;
        return [...prev, shortcutItem];
      });
    }
    setWindows((ws) => ws.filter((w) => w.id !== id));
  };
  const focusWin = (id) => {
    zRef.current += 1;
    const z = zRef.current;
    setWindows((ws) => ws.map((w) => w.id === id ? {
      ...w,
      z
    } : w));
    setActiveId(id);
  };
  const minimizeWin = (id) => setWindows((ws) => ws.map((w) => w.id === id ? {
    ...w,
    minimized: true
  } : w));
  const maximizeWin = (id) => setWindows((ws) => ws.map((w) => w.id === id ? {
    ...w,
    maximized: !w.maximized
  } : w));
  const moveWin = (id, x, y) => setWindows((ws) => ws.map((w) => w.id === id ? {
    ...w,
    x,
    y
  } : w));
  const toggleTask = (id) => {
    const w = windows.find((w2) => w2.id === id);
    if (!w) return;
    if (w.minimized || activeId !== id) {
      setWindows((ws) => ws.map((x) => x.id === id ? {
        ...x,
        minimized: false
      } : x));
      focusWin(id);
    } else {
      minimizeWin(id);
    }
  };
  const desktopIcons = [{
    id: "explorer",
    title: "My Computer",
    icon: "📁"
  }, {
    id: "browser",
    title: "Netscape Navigator",
    icon: "🌐"
  }, {
    id: "winamp",
    title: "Winamp",
    icon: "📻"
  }, {
    id: "icq",
    title: "ICQ Client",
    icon: "🌸"
  }, {
    id: "recycle",
    title: "Recycle Bin",
    icon: recycleBin.length > 0 ? "🗑️📄" : "🗑️"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BSODSystem, { onRegister: registerCrash, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "desktop-bg h-screen w-screen relative overflow-hidden font-pixel", onClick: () => setStartOpen(false), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 grid grid-cols-1 gap-3 p-2", children: [
      desktopIcons.map((iconDef) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onDoubleClick: () => openApp(iconDef.id), onClick: (e) => e.stopPropagation(), className: "flex flex-col items-center gap-0.5 w-16 p-1 text-white text-[11px] focus:bg-titlebar/40 focus:outline-dotted focus:outline-1 focus:outline-white", style: {
        textShadow: "1px 1px 0 #000"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl leading-none", children: iconDef.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center leading-tight break-words", children: iconDef.title })
      ] }, iconDef.id)),
      minesUnlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onDoubleClick: () => openApp("mines"), onClick: (e) => e.stopPropagation(), className: "flex flex-col items-center gap-0.5 w-16 p-1 text-white text-[11px] focus:bg-titlebar/40 focus:outline-dotted focus:outline-1 focus:outline-white", style: {
        textShadow: "1px 1px 0 #000"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl leading-none", children: "💣" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center leading-tight break-words", children: "Minesweeper" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onDoubleClick: (e) => {
      e.stopPropagation();
      crash();
    }, onClick: (e) => e.stopPropagation(), className: "absolute flex flex-col items-center gap-0.5 w-16 p-1 text-white text-[11px] focus:bg-titlebar/40 focus:outline-dotted focus:outline-1 focus:outline-white", style: {
      bottom: "40px",
      right: "8px",
      textShadow: "1px 1px 0 #000",
      opacity: 0.55
    }, title: "⚠ Do not open", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl leading-none", children: "⚙️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center leading-tight break-words", children: "SYSTEM32" })
    ] }),
    windows.map((w) => {
      const app = APPS.find((a) => a.id === w.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Window, { win: w, active: activeId === w.id, onClose: closeWin, onFocus: focusWin, onMinimize: minimizeWin, onMaximize: maximizeWin, onMove: moveWin, children: app.render() }, w.id);
    }),
    clippyVisible && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-12 right-4 z-[99999] flex flex-col items-end gap-1 select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bevel-out bg-[#ffffe1] text-black border border-black p-2 rounded shadow-md max-w-xs relative text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 -bottom-2 w-0 h-0 border-t-8 border-t-[#ffffe1] border-r-8 border-r-transparent border-l-8 border-l-transparent" }),
        clippyMessage
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: triggerClippyTip, className: "win-btn !p-1 text-[10px]", children: "Ask Clippy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setClippyVisible(false), className: "win-btn !p-1 text-[10px]", children: "Dismiss" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "📎" })
      ] })
    ] }),
    emptyingProgress !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/20 flex items-center justify-center z-[999999] select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "window w-64 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-bar-text", children: "Emptying Recycle Bin" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "window-body text-center p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-2 animate-bounce", children: "📄🗑️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-xs", children: "Deleting items permanently..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress-bar-value", style: {
          width: `${emptyingProgress}%`
        } }) })
      ] })
    ] }) }),
    aolDialing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center z-[999999] select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "window w-72 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-bar-text", children: "AOL Dialer" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "window-body p-4 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-bold text-[#000080] text-sm", children: "America Online" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-gray-700 bg-white p-2 border bevel-thin-in font-mono min-h-12", children: aolStatus }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress-bar-value animate-[pulse_1.5s_infinite]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAolDialing(false), className: "win-btn mt-2 align-self-end w-20 mx-auto", children: "Cancel" })
      ] })
    ] }) }),
    startOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[30px] left-0 bevel-out bg-window w-56 z-[9999]", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-titlebar text-titlebar-foreground writing-vertical font-bold px-1 py-2 text-base", style: {
        writingMode: "vertical-rl",
        transform: "rotate(180deg)"
      }, children: [
        "Webcore",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "98" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 py-1", children: [
        desktopIcons.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openApp(a.id), className: "flex items-center gap-2 w-full px-2 py-1 text-left hover:bg-titlebar hover:text-titlebar-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: a.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: a.title })
        ] }, a.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-[color:var(--border-dark)] my-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 w-full px-2 py-1 text-left hover:bg-titlebar hover:text-titlebar-foreground", onClick: () => crash(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "⏻" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shut Down..." })
        ] })
      ] })
    ] }) }),
    konamiToast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-1/2 left-1/2 z-[99999]", style: {
      transform: "translate(-50%, -50%)",
      background: "#000080",
      color: "#fff",
      border: "3px outset #c0c0c0",
      padding: "16px 28px",
      textAlign: "center",
      fontFamily: "MS Sans Serif, Tahoma, sans-serif",
      boxShadow: "4px 4px 0 #000",
      minWidth: "260px",
      animation: "konamiPop 0.25s ease-out"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: "28px",
        marginBottom: "6px"
      }, children: "💣" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: "14px",
        fontWeight: "bold",
        letterSpacing: "1px",
        marginBottom: "4px"
      }, children: "CHEAT CODE ACTIVATED" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: "11px",
        color: "#adf",
        marginBottom: "8px"
      }, children: "↑↑↓↓←→←→BA" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: "12px",
        color: "#ff0"
      }, children: "Minesweeper unlocked! 🎉" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 h-[30px] bevel-out bg-taskbar flex items-center px-1 gap-1 z-[1000]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: (e) => {
        e.stopPropagation();
        setStartOpen((o) => !o);
      }, className: `win-btn font-bold flex items-center gap-1 h-[24px] ${startOpen ? "win-btn-active" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🪟" }),
        " Start"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-[60%] bg-[color:var(--border-dark)] mx-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex gap-1 overflow-hidden", children: windows.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleTask(w.id), className: `win-btn flex items-center gap-1 h-[24px] max-w-[160px] truncate ${activeId === w.id && !w.minimized ? "win-btn-active" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: w.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: w.title.split(" — ")[0] })
      ] }, w.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bevel-thin-in px-2 h-[22px] flex items-center gap-1 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔊" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: clock })
      ] })
    ] })
  ] }) });
}
export {
  Desktop as component
};
