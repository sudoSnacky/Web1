import { useState, useEffect, useRef } from "react";

interface Track {
  title: string;
  duration: string;
  notes: { note: number; dur: number }[];
}

const RETRO_PLAYLIST: Track[] = [
  {
    title: "1. DJ Snacky - Cyber Chiptune Loop.mp3",
    duration: "0:30",
    notes: [
      { note: 60, dur: 0.2 }, { note: 63, dur: 0.2 }, { note: 67, dur: 0.2 }, { note: 72, dur: 0.2 },
      { note: 70, dur: 0.2 }, { note: 67, dur: 0.2 }, { note: 65, dur: 0.2 }, { note: 67, dur: 0.2 },
      { note: 58, dur: 0.2 }, { note: 62, dur: 0.2 }, { note: 65, dur: 0.2 }, { note: 70, dur: 0.2 },
      { note: 67, dur: 0.2 }, { note: 65, dur: 0.2 }, { note: 62, dur: 0.2 }, { note: 65, dur: 0.2 }
    ]
  },
  {
    title: "2. MC Webcore - Y2K Millennium.mp3",
    duration: "0:25",
    notes: [
      { note: 50, dur: 0.15 }, { note: 50, dur: 0.15 }, { note: 62, dur: 0.15 }, { note: 50, dur: 0.15 },
      { note: 55, dur: 0.15 }, { note: 50, dur: 0.15 }, { note: 58, dur: 0.15 }, { note: 57, dur: 0.3 },
      { note: 50, dur: 0.15 }, { note: 50, dur: 0.15 }, { note: 62, dur: 0.15 }, { note: 50, dur: 0.15 },
      { note: 55, dur: 0.15 }, { note: 50, dur: 0.15 }, { note: 60, dur: 0.3 }
    ]
  },
  {
    title: "3. Retro System - kernel32 Panic.mp3",
    duration: "0:20",
    notes: [
      { note: 72, dur: 0.1 }, { note: 71, dur: 0.1 }, { note: 69, dur: 0.1 }, { note: 67, dur: 0.1 },
      { note: 65, dur: 0.1 }, { note: 64, dur: 0.1 }, { note: 62, dur: 0.1 }, { note: 60, dur: 0.3 },
      { note: 67, dur: 0.2 }, { note: 67, dur: 0.2 }, { note: 69, dur: 0.2 }, { note: 67, dur: 0.4 }
    ]
  }
];

export function Winamp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [balance, setBalance] = useState(0);
  const [eqSliders, setEqSliders] = useState([50, 40, 60, 70, 50]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const visualizerFrameRef = useRef<number | null>(null);
  const playTimeIntervalRef = useRef<number | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);

  const currentTrack = RETRO_PLAYLIST[currentTrackIdx];

  // MIDI to Frequency helper
  const mtof = (note: number) => Math.pow(2, (note - 69) / 12) * 440;

  // Initialize audio context
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  // Start synth playback
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

      // Synthesize note
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "triangle"; // Nice retro chip tone
      osc.frequency.setValueAtTime(mtof(noteData.note), ctx.currentTime);

      // Volume scaling
      const baseVol = (volume / 100) * 0.15;
      gainNode.gain.setValueAtTime(baseVol, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + noteData.dur - 0.02);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + noteData.dur);

      activeOscillatorsRef.current.push(osc);
      // Clean up reference
      setTimeout(() => {
        activeOscillatorsRef.current = activeOscillatorsRef.current.filter(o => o !== osc);
      }, noteData.dur * 1000);

      noteIdx = (noteIdx + 1) % track.notes.length;

      // Queue next note
      synthIntervalRef.current = window.setTimeout(playNextNote, noteData.dur * 1000);
    };

    playNextNote();

    // Increment play clock
    playTimeIntervalRef.current = window.setInterval(() => {
      setCurrentTime(t => t + 1);
    }, 1000);
  };

  // Stop synth playback
  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (playTimeIntervalRef.current) {
      clearInterval(playTimeIntervalRef.current);
      playTimeIntervalRef.current = null;
    }
    activeOscillatorsRef.current.forEach(o => {
      try { o.stop(); } catch (e) {}
    });
    activeOscillatorsRef.current = [];
  };

  // Play button click
  const handlePlay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    startSynth();
  };

  // Pause button click
  const handlePause = () => {
    setIsPlaying(false);
    stopSynth();
  };

  // Stop button click
  const handleStop = () => {
    setIsPlaying(false);
    stopSynth();
    setCurrentTime(0);
  };

  // Next / Prev Track
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

  // Canvas visualizer rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        // Draw green stereo bars
        ctx.fillStyle = "#00ff00";
        const numBars = 16;
        const barWidth = Math.floor(canvas.width / numBars) - 1;

        for (let i = 0; i < numBars; i++) {
          // Calculate a value based on time and index for synthetic visualization
          const timeFactor = Date.now() * 0.005;
          const heightFactor = Math.sin(timeFactor + i) * 0.5 + 0.5;
          const barHeight = Math.max(2, heightFactor * (canvas.height - 4));
          const x = i * (barWidth + 1);
          const y = canvas.height - barHeight;

          // Draw gradient colors
          if (barHeight > canvas.height * 0.7) {
            ctx.fillStyle = "#ff0000"; // Peak red
          } else if (barHeight > canvas.height * 0.4) {
            ctx.fillStyle = "#ffff00"; // Mid yellow
          } else {
            ctx.fillStyle = "#00ff00"; // Low green
          }

          ctx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        // Draw flat line
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

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col bg-black text-[#00ff00] font-mono select-none p-1.5 border border-[#333] shadow-lg rounded" style={{ width: "275px", fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Top panel section (Metallic styling background) */}
      <div className="relative p-2 rounded flex flex-col gap-1.5" style={{
        background: "linear-gradient(180deg, #333 0%, #111 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)"
      }}>
        {/* Track Title Scrolling Marquee */}
        <div className="bg-[#050505] text-[#00ff00] h-6 flex items-center overflow-hidden border border-[#222] px-1 rounded relative">
          <div ref={marqueeRef} className={`whitespace-nowrap text-xs ${isPlaying ? "animate-[marquee_12s_linear_infinite]" : ""}`}>
            {currentTrack.title} *** WINAMP 2.81 *** WINAMP 2.81 ***
          </div>
        </div>

        {/* Display Panel */}
        <div className="flex justify-between items-center gap-1 bg-black p-1 border border-[#222] rounded">
          {/* Time digits */}
          <div className="text-xl font-bold tracking-widest text-[#ffcc00] px-1">
            {formatTime(currentTime)}
          </div>
          {/* Audio Spec Display */}
          <div className="text-[9px] text-[#888] flex flex-col text-right">
            <span>kbps: 128</span>
            <span>kHz: 44</span>
          </div>
        </div>

        {/* Visualizer Canvas */}
        <div className="bg-black border border-[#222] rounded h-10 overflow-hidden">
          <canvas ref={canvasRef} width={250} height={40} className="w-full h-full" />
        </div>

        {/* Volume & Balance sliders */}
        <div className="flex gap-2 text-[10px] text-[#ccc] items-center">
          <div className="flex-1 flex flex-col">
            <span>VOL: {volume}%</span>
            <input
              type="range"
              min="0" max="100"
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="accent-[#00ff00] bg-[#222] h-1.5 rounded cursor-pointer"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <span>BAL: {balance === 0 ? "CENTER" : balance > 0 ? `R:${balance}` : `L:${Math.abs(balance)}`}</span>
            <input
              type="range"
              min="-50" max="50"
              value={balance}
              onChange={e => setBalance(Number(e.target.value))}
              className="accent-[#00ff00] bg-[#222] h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Winamp classic controls */}
        <div className="flex justify-center gap-1.5 mt-1">
          <button onClick={handlePrev} className="px-2 py-1 text-xs rounded bg-[#444] border border-[#222] text-[#fff] active:bg-[#222] active:text-[#00ff00] shadow">
            |&lt;&lt;
          </button>
          <button onClick={handlePlay} className={`px-2.5 py-1 text-xs rounded border border-[#222] shadow ${isPlaying ? "bg-[#00ff00] text-black" : "bg-[#444] text-[#fff] active:bg-[#222] active:text-[#00ff00]"}`}>
            ▶
          </button>
          <button onClick={handlePause} className={`px-2.5 py-1 text-xs rounded border border-[#222] shadow ${!isPlaying && currentTime > 0 ? "bg-[#ffcc00] text-black" : "bg-[#444] text-[#fff] active:bg-[#222] active:text-[#00ff00]"}`}>
            ||
          </button>
          <button onClick={handleStop} className="px-2.5 py-1 text-xs rounded bg-[#444] border border-[#222] text-[#fff] active:bg-[#222] active:text-[#ff0000] shadow">
            ■
          </button>
          <button onClick={handleNext} className="px-2 py-1 text-xs rounded bg-[#444] border border-[#222] text-[#fff] active:bg-[#222] active:text-[#00ff00] shadow">
            &gt;&gt;|
          </button>
        </div>
      </div>

      {/* Playlist view */}
      <div className="mt-1.5 bg-[#111] border border-[#222] rounded p-1 text-[11px] text-[#888] flex flex-col gap-1 max-h-24 overflow-y-auto">
        <div className="text-[10px] text-[#ccc] border-b border-[#222] pb-0.5 mb-1 font-bold">PLAYLIST</div>
        {RETRO_PLAYLIST.map((t, i) => (
          <div
            key={i}
            onClick={() => {
              handleStop();
              setCurrentTrackIdx(i);
            }}
            className={`cursor-pointer px-1 py-0.5 rounded flex justify-between ${
              i === currentTrackIdx ? "text-[#00ff00] bg-[#222]" : "hover:text-[#fff]"
            }`}
          >
            <span className="truncate">{t.title.split(" - ")[1] || t.title}</span>
            <span>{t.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
