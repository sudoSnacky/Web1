import { useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

/**
 * Fires `onSuccess` once every time the full Konami Code is typed.
 * Progress resets automatically after 2 s of inactivity.
 */
export function useKonamiCode(onSuccess: () => void) {
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when the user is typing in an input / textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const expected = KONAMI[idxRef.current];
      const pressed = e.key;

      if (pressed === expected) {
        idxRef.current += 1;

        // Reset the 2-second idle timer
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          idxRef.current = 0;
        }, 2000);

        if (idxRef.current === KONAMI.length) {
          idxRef.current = 0;
          if (timerRef.current) clearTimeout(timerRef.current);
          onSuccess();
        }
      } else {
        // Wrong key — restart from scratch (handle ArrowUp at pos 0 immediately)
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
