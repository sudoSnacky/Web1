import { useState, useEffect, useRef, useCallback } from "react";

// ─── Phase machine ────────────────────────────────────────────────────────────
// idle → bsod → post → booting → idle
type Phase = "idle" | "bsod" | "post" | "booting";

// ─── POST lines that scroll past during the fake boot ────────────────────────
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
  "Loading desktop environment...",
];

const BOOT_BAR_LABEL = "WEBCORE98";

// ─── BSOD text content ────────────────────────────────────────────────────────
const BSOD_LINES = [
  "A fatal exception 0E has occurred at 0028:C0011E36 in VxD WEBCORE(01) +",
  "00010E36. The current application will be terminated.",
  "",
  "  * Press any key to terminate the current application.",
  "  * Press CTRL+ALT+DEL to restart your computer. You will",
  "    lose any unsaved information in all applications.",
  "",
  "Press any key to continue _",
];

// ─── Main component ───────────────────────────────────────────────────────────
interface BSODSystemProps {
  /** Render the desktop content. Hidden during crash / reboot. */
  children: React.ReactNode;
  /** Optional error code text. Defaults to FATAL_ERROR: DESIGN_TOO_GOOD */
  errorCode?: string;
  /** Expose a trigger function via ref pattern */
  onRegister: (trigger: () => void) => void;
}

export function BSODSystem({ children, errorCode, onRegister }: BSODSystemProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [postLines, setPostLines] = useState<string[]>([]);
  const [bootPct, setBootPct] = useState(0);
  const [desktopOpacity, setDesktopOpacity] = useState(1);
  const lineTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const code = errorCode ?? "FATAL_ERROR: DESIGN_TOO_GOOD";

  // ── Register trigger with parent ──────────────────────────────────────────
  const trigger = useCallback(() => {
    setPhase("bsod");
    setDesktopOpacity(0);
  }, []);

  useEffect(() => {
    onRegister(trigger);
  }, [onRegister, trigger]);

  // ── Any-key handler (BSOD phase) ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== "bsod") return;
    const onKey = () => startPost();
    const onClick = () => startPost();
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── POST sequence ─────────────────────────────────────────────────────────
  const startPost = useCallback(() => {
    setPhase("post");
    setPostLines([]);

    // Clear any existing timers
    lineTimersRef.current.forEach(clearTimeout);
    lineTimersRef.current = [];

    // Stream POST lines one by one
    POST_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setPostLines(prev => [...prev, line]);
      }, i * 120);
      lineTimersRef.current.push(t);
    });

    // Transition to boot bar after all lines
    const totalDelay = POST_LINES.length * 120 + 200;
    const t = setTimeout(() => {
      setPhase("booting");
      setBootPct(0);
    }, totalDelay);
    lineTimersRef.current.push(t);
  }, []);

  // ── Boot bar animation ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "booting") return;

    // Animate progress bar in steps
    const steps = 30;
    const interval = 60; // ms per tick
    let tick = 0;
    const id = setInterval(() => {
      tick++;
      setBootPct(Math.min(100, Math.round((tick / steps) * 100)));
      if (tick >= steps) {
        clearInterval(id);
        // Fade desktop back in
        setTimeout(() => {
          setDesktopOpacity(1);
          // Small delay then back to idle
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

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ── Desktop (always mounted, opacity-faded during crash) ── */}
      <div
        style={{
          width: "100%",
          height: "100%",
          opacity: desktopOpacity,
          transition: desktopOpacity === 1 ? "opacity 0.6s ease-in" : "opacity 0s",
          pointerEvents: isOverlay ? "none" : "auto",
        }}
      >
        {children}
      </div>

      {/* ── BSOD overlay ── */}
      {phase === "bsod" && (
        <div
          style={{
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
            animation: "bsodFadeIn 0.1s steps(1) forwards",
          }}
        >
          {/* Big header */}
          <div
            style={{
              background: "#aaaaaa",
              color: "#0000aa",
              padding: "4px 12px",
              fontSize: "clamp(13px, 1.8vw, 18px)",
              fontWeight: "bold",
              marginBottom: "24px",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            Windows
          </div>

          {/* Error code */}
          <div
            style={{
              fontSize: "clamp(12px, 1.6vw, 16px)",
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "20px",
              letterSpacing: "0.02em",
              textAlign: "center",
            }}
          >
            {code}
          </div>

          {/* Body text */}
          <div style={{ maxWidth: "640px", textAlign: "left" }}>
            {BSOD_LINES.map((line, i) => (
              <div key={i} style={{ marginBottom: line === "" ? "8px" : "2px" }}>
                {line || "\u00a0"}
              </div>
            ))}
          </div>

          {/* Blinking cursor hint */}
          <div
            style={{
              marginTop: "32px",
              fontSize: "clamp(10px, 1.2vw, 13px)",
              color: "#aaaaff",
              animation: "bsodBlink 1s steps(2) infinite",
            }}
          >
            ▌ Click anywhere or press any key to reboot...
          </div>
        </div>
      )}

      {/* ── POST / boot screen overlay ── */}
      {(phase === "post" || phase === "booting") && (
        <div
          style={{
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
            overflowY: "hidden",
          }}
        >
          {/* POST lines */}
          {phase === "post" && (
            <div>
              {postLines.map((line, i) => (
                <div key={i} style={{ color: line.startsWith("  ") ? "#888" : "#aaa" }}>
                  {line || "\u00a0"}
                </div>
              ))}
              {/* Blinking cursor at end */}
              <span style={{ animation: "bsodBlink 0.6s steps(2) infinite", color: "#aaa" }}>_</span>
            </div>
          )}

          {/* Boot progress bar */}
          {phase === "booting" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              {/* Logo */}
              <div
                style={{
                  fontSize: "clamp(22px, 4vw, 40px)",
                  fontWeight: "bold",
                  color: "#fff",
                  letterSpacing: "0.15em",
                  fontFamily: "serif",
                }}
              >
                <span style={{ color: "#0000ff" }}>Web</span>
                <span style={{ color: "#fff" }}>core</span>
                <sup style={{ fontSize: "0.4em", color: "#aaa", marginLeft: "2px" }}>98</sup>
              </div>

              <div style={{ color: "#888", fontSize: "clamp(9px, 1.1vw, 12px)", letterSpacing: "0.08em" }}>
                Starting {BOOT_BAR_LABEL}...
              </div>

              {/* Progress bar — Win98 chunky block style */}
              <div
                style={{
                  width: "clamp(200px, 40vw, 320px)",
                  height: "18px",
                  border: "2px solid #555",
                  background: "#111",
                  overflow: "hidden",
                  display: "flex",
                  gap: "2px",
                  padding: "2px",
                  boxSizing: "border-box",
                }}
              >
                {Array.from({ length: 20 }).map((_, i) => {
                  const filled = i < Math.round((bootPct / 100) * 20);
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        background: filled ? "#0000cc" : "transparent",
                        transition: "background 0.05s",
                      }}
                    />
                  );
                })}
              </div>

              <div style={{ color: "#555", fontSize: "clamp(9px, 1vw, 11px)" }}>
                {bootPct}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
