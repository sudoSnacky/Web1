import { useState, useEffect, useRef } from "react";

interface Message {
  sender: string;
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  status: "online" | "offline" | "away";
  avatar: string;
  replies: string[];
}

const INITIAL_CONTACTS: Contact[] = [
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

export function ICQ() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [chatLogs, setChatLogs] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find(c => c.id === activeContactId);
  const messages = activeContactId ? chatLogs[activeContactId] || [] : [];

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Synthesize classic ICQ "Uh oh!" two-tone alert
  const playUhOhSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      // First tone (high)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(950, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Second tone (slightly higher/short delay)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1050, now + 0.08);
      gain2.gain.setValueAtTime(0.08, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
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

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { sender: "You", text: inputText, time };

    setChatLogs(logs => ({
      ...logs,
      [activeContactId]: [...(logs[activeContactId] || []), userMsg]
    }));
    setInputText("");

    // Queue auto response
    const contact = activeContact!;
    setTimeout(() => {
      const replyText = contact.replies[Math.floor(Math.random() * contact.replies.length)];
      const replyMsg: Message = { sender: contact.name, text: replyText, time };
      
      setChatLogs(logs => ({
        ...logs,
        [activeContactId]: [...(logs[activeContactId] || []), replyMsg]
      }));

      // Play ICQ beep sound
      playUhOhSound();
    }, 1200);
  };

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-red-500";
    }
  };

  return (
    <div className="flex h-full bg-window text-[11px] font-pixel select-none overflow-hidden">
      {/* Contact List (Left Panel) */}
      <div className="w-44 border-r border-[color:var(--border-dark)] flex flex-col h-full bg-white select-none">
        <div className="bg-titlebar text-titlebar-foreground px-2 py-1 flex items-center justify-between text-[10px]">
          <span>ICQ #99187315</span>
          <span>🟢 Online</span>
        </div>
        <div className="flex-1 overflow-auto p-1.5 space-y-1">
          <div className="font-bold text-[10px] text-gray-500 uppercase tracking-wider mb-1">Contacts</div>
          {contacts.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveContactId(c.id)}
              className={`flex items-center gap-2 w-full text-left p-1 rounded ${
                activeContactId === c.id ? "bg-titlebar text-titlebar-foreground" : "hover:bg-gray-100"
              }`}
            >
              <span>{c.avatar}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className={`w-2 h-2 rounded-full ${getStatusColor(c.status)}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Message Pane (Right Panel) */}
      <div className="flex-1 flex flex-col h-full bg-window">
        {activeContact ? (
          <div className="flex flex-col h-full">
            {/* Header info */}
            <div className="p-1.5 bg-[color:var(--muted)] border-b border-[color:var(--border-dark)] font-bold flex items-center gap-2">
              <span>{activeContact.avatar}</span>
              <span>Chatting with {activeContact.name}</span>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-auto bg-white p-2 space-y-2">
              {messages.length === 0 && (
                <div className="text-gray-400 text-center py-4">Send a message to start chatting!</div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === "You" ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-gray-500 font-bold mb-0.5">{m.sender} - {m.time}</span>
                  <div className={`p-1.5 rounded-lg max-w-[85%] border shadow-sm ${
                    m.sender === "You" 
                      ? "bg-titlebar text-titlebar-foreground border-blue-800" 
                      : "bg-gray-200 text-black border-gray-300"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-1.5 border-t border-[color:var(--border-dark)] flex gap-1 bg-window">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
                placeholder="Type a message..."
                className="flex-1 bevel-thin-in px-1 bg-white text-black outline-none h-6"
              />
              <button onClick={handleSendMessage} className="win-btn px-3 h-6">Send</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500 p-4 text-center">
            <div className="text-4xl mb-2">🌸</div>
            <div className="font-bold">Welcome to ICQ Chat</div>
            <p className="text-[10px] mt-1">Select a contact from the left list to begin messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
