import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type CellState = "hidden" | "revealed" | "flagged" | "question";
type GamePhase = "idle" | "playing" | "won" | "lost";

interface Cell {
  mine: boolean;
  adj: number;      // adjacent mine count
  state: CellState;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const COLS = 16;
const ROWS = 16;
const MINES = 40;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, adj: 0, state: "hidden" }))
  );
}

function neighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
    }
  return out;
}

function plantMines(board: Cell[][], safeR: number, safeC: number): Cell[][] {
  const next = board.map(row => row.map(c => ({ ...c })));
  const safe = new Set<string>([
    `${safeR},${safeC}`,
    ...neighbors(safeR, safeC).map(([r, c]) => `${r},${c}`),
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

  // Calculate adjacency
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      next[r][c].adj = neighbors(r, c).filter(([nr, nc]) => next[nr][nc].mine).length;

  return next;
}

function floodReveal(board: Cell[][], r: number, c: number): Cell[][] {
  const next = board.map(row => row.map(cell => ({ ...cell })));
  const q: [number, number][] = [[r, c]];
  while (q.length) {
    const [cr, cc] = q.pop()!;
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

function checkWin(board: Cell[][]): boolean {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell.mine && cell.state !== "revealed") return false;
    }
  return true;
}

// ─── Digit display (7-segment style) ─────────────────────────────────────────
function LCDDigits({ value, digits = 3 }: { value: number; digits?: number }) {
  const clamped = Math.max(-99, Math.min(999, value));
  const str = String(Math.abs(clamped)).padStart(digits, "0").slice(-digits);
  const display = clamped < 0 ? `-${str.slice(1)}` : str;

  return (
    <div
      style={{
        background: "#000",
        color: "#f00",
        fontFamily: "\"Lucida Console\", \"Courier New\", monospace",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "2px",
        padding: "2px 6px",
        border: "2px inset #808080",
        minWidth: `${digits * 16 + 12}px`,
        textAlign: "right",
        userSelect: "none",
      }}
    >
      {display}
    </div>
  );
}

// ─── Smiley reset button ──────────────────────────────────────────────────────
const FACE: Record<GamePhase, string> = {
  idle:    "🙂",
  playing: "😮",
  won:     "😎",
  lost:    "😵",
};

// ─── Adjacency colours (classic Minesweeper palette) ─────────────────────────
const NUM_COLORS: Record<number, string> = {
  1: "#0000ff", 2: "#007b00", 3: "#ff0000",
  4: "#00007b", 5: "#7b0000", 6: "#007b7b",
  7: "#000000", 8: "#7b7b7b",
};

// ─── Main component ───────────────────────────────────────────────────────────
export function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(makeBoard);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [flagCount, setFlagCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [pressing, setPressing] = useState(false);   // for smiley 😮
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => setElapsed(t => Math.min(t + 1, 999)), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBoard(makeBoard());
    setPhase("idle");
    setFlagCount(0);
    setElapsed(0);
    setPressing(false);
  }, []);

  // ── Left-click: reveal ───────────────────────────────────────────────────
  const reveal = useCallback((r: number, c: number) => {
    setBoard(prev => {
      const cell = prev[r][c];
      if (cell.state !== "hidden") return prev;

      let next = prev;

      // First click — plant mines now (guarantee safe first click)
      if (phase === "idle") {
        next = plantMines(prev, r, c);
        setPhase("playing");
        setElapsed(0);
      }

      if (next[r][c].mine) {
        // Boom — reveal all mines
        const exploded = next.map(row =>
          row.map(cell => cell.mine ? { ...cell, state: "revealed" as CellState } : { ...cell })
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

  // ── Right-click: cycle hidden → flag → question → hidden ────────────────
  const flag = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    setBoard(prev => {
      const cell = prev[r][c];
      if (cell.state === "revealed") return prev;
      const next = prev.map(row => row.map(c => ({ ...c })));
      if (cell.state === "hidden") {
        next[r][c].state = "flagged";
        setFlagCount(f => f + 1);
      } else if (cell.state === "flagged") {
        next[r][c].state = "question";
        setFlagCount(f => f - 1);
      } else {
        next[r][c].state = "hidden";
      }
      return next;
    });
  }, []);

  // ── Chord click: middle-click or dbl-click to reveal neighbours ──────────
  const chord = useCallback((r: number, c: number) => {
    setBoard(prev => {
      const cell = prev[r][c];
      if (cell.state !== "revealed" || cell.adj === 0) return prev;
      const flagged = neighbors(r, c).filter(([nr, nc]) => prev[nr][nc].state === "flagged").length;
      if (flagged !== cell.adj) return prev;
      let next = prev;
      neighbors(r, c).forEach(([nr, nc]) => {
        if (prev[nr][nc].state === "hidden") {
          if (prev[nr][nc].mine) {
            // Chord hit a mine
            next = next.map(row =>
              row.map(cell => cell.mine ? { ...cell, state: "revealed" as CellState } : { ...cell })
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

  // ── Render cell ──────────────────────────────────────────────────────────
  const renderCell = (cell: Cell, r: number, c: number) => {
    const isActive = phase !== "won" && phase !== "lost";
    let content: React.ReactNode = null;
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
        content = (
          <span style={{ color: NUM_COLORS[cell.adj], fontWeight: "bold", fontSize: "12px" }}>
            {cell.adj}
          </span>
        );
      }
    } else if (cell.state === "flagged") {
      content = "🚩";
      // Show wrong flags as ❌ after loss
      if (phase === "lost" && !cell.mine) content = "❌";
    } else if (cell.state === "question") {
      content = (
        <span style={{ color: "#7b007b", fontWeight: "bold", fontSize: "12px" }}>?</span>
      );
    }

    return (
      <td
        key={c}
        onMouseDown={(e) => {
          if (!isActive || cell.state !== "hidden") return;
          if (e.button === 0) setPressing(true);
        }}
        onMouseUp={(e) => {
          setPressing(false);
          if (!isActive) return;
          if (e.button === 0 && cell.state === "hidden") reveal(r, c);
          if (e.button === 1) chord(r, c);
        }}
        onContextMenu={(e) => { if (isActive) flag(e, r, c); }}
        onDoubleClick={() => { if (isActive && cell.state === "revealed") chord(r, c); }}
        style={{
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
          boxSizing: "border-box",
        }}
      >
        {content}
      </td>
    );
  };

  return (
    <div
      style={{
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
        overflow: "auto",
      }}
    >
      {/* ── Header row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: COLS * 20 + 4,
          padding: "4px 6px",
          marginBottom: "6px",
          border: "2px inset #808080",
          background: "#c0c0c0",
          boxSizing: "border-box",
        }}
      >
        <LCDDigits value={minesLeft} />

        <button
          onClick={reset}
          title="New Game"
          style={{
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
            justifyContent: "center",
          }}
        >
          {faceEmoji}
        </button>

        <LCDDigits value={elapsed} />
      </div>

      {/* ── Win/Loss Banner ── */}
      {(phase === "won" || phase === "lost") && (
        <div
          style={{
            marginBottom: "4px",
            padding: "3px 10px",
            background: phase === "won" ? "#008000" : "#800000",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "11px",
            border: "1px solid #000",
          }}
        >
          {phase === "won" ? "🎉 YOU WIN! Great job!" : "💥 BOOM! Game Over. Click 🙂 to retry."}
        </div>
      )}

      {/* ── Board ── */}
      <div
        style={{
          border: "3px inset #808080",
          display: "inline-block",
        }}
      >
        <table
          style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <tbody>
            {board.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => renderCell(cell, r, c))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Instructions ── */}
      <div
        style={{
          marginTop: "5px",
          fontSize: "10px",
          color: "#444",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Left-click to reveal · Right-click to flag 🚩 · Double-click to chord<br />
        {MINES} mines · {ROWS}×{COLS} · Classic Expert Mode
      </div>
    </div>
  );
}
