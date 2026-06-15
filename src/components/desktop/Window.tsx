import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

interface WindowProps {
  win: WindowState;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  active: boolean;
  children: ReactNode;
}

export function Window({ win, onClose, onFocus, onMinimize, onMaximize, onMove, active, children }: WindowProps) {
  const draggingRef = useRef<{ ox: number; oy: number } | null>(null);

  useEffect(() => {
    function onUp() {
      draggingRef.current = null;
    }
    function onMouseMove(e: MouseEvent) {
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

  const style: CSSProperties = win.maximized
    ? { left: 0, top: 0, width: "100%", height: "calc(100% - 30px)", zIndex: win.z }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z };

  return (
    <div
      className="absolute bevel-out bg-window flex flex-col"
      style={style}
      onMouseDown={() => onFocus(win.id)}
    >
      <div
        className={`flex items-center justify-between px-1 py-0.5 select-none ${
          active ? "bg-titlebar text-titlebar-foreground" : "bg-[color:var(--titlebar-inactive)] text-titlebar-foreground"
        }`}
        onMouseDown={(e) => {
          if (win.maximized) return;
          const rect = (e.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect();
          draggingRef.current = { ox: e.clientX - rect.left, oy: e.clientY - rect.top };
          onFocus(win.id);
        }}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <div className="flex items-center gap-1 font-bold">
          <span>{win.icon}</span>
          <span>{win.title}</span>
        </div>
        <div className="flex gap-0.5">
          <button className="win-btn !px-1 !py-0 font-bold leading-none h-[18px] w-[20px]" onClick={() => onMinimize(win.id)}>
            _
          </button>
          <button className="win-btn !px-1 !py-0 font-bold leading-none h-[18px] w-[20px]" onClick={() => onMaximize(win.id)}>
            □
          </button>
          <button className="win-btn !px-1 !py-0 font-bold leading-none h-[18px] w-[20px]" onClick={() => onClose(win.id)}>
            ×
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bevel-thin-in bg-window m-0.5">{children}</div>
    </div>
  );
}
