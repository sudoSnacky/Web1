import { useState, useRef, useCallback, KeyboardEvent } from "react";
import {
  RETRO_SITE_COMPONENTS, RETRO_SITE_URLS, CATEGORY_POOLS,
  type RetroSiteId, type CatEntry,
} from "./RetroSites";

// ─── Route definitions ────────────────────────────────────────────────────────
type PageKey = "home" | "search" | "links" | "portfolio" | `site:${RetroSiteId}`;

const PAGES: Record<string, PageKey> = {
  "C:\\Users\\Home\\index.html": "home",
  "http://www.search98.com": "search",
  "http://webring.net/links": "links",
  "http://portfolio.local/work": "portfolio",
  // retro site URLs
  ...Object.fromEntries(
    Object.entries(RETRO_SITE_URLS).map(([id, url]) => [url, `site:${id}` as PageKey])
  ),
};

const PAGE_URLS: Record<PageKey, string> = {
  home:      "C:\\Users\\Home\\index.html",
  search:    "http://www.search98.com",
  links:     "http://webring.net/links",
  portfolio: "http://portfolio.local/work",
  // retro site URLs
  ...Object.fromEntries(
    Object.entries(RETRO_SITE_URLS).map(([id, url]) => [`site:${id}`, url])
  ),
} as Record<PageKey, string>;


// ─── Page 1 · Geocities Homepage ─────────────────────────────────────────────
function GeoHome({ navigate }: { navigate: (p: PageKey) => void }) {
  return (
    <div
      style={{
        minHeight: "100%",
        background: "#000080",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='10' height='10' fill='%23000099'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23000099'/%3E%3C/svg%3E")`,
        backgroundSize: "20px 20px",
        fontFamily: "Times New Roman, serif",
        color: "#ffff00",
        fontSize: "14px",
        padding: "8px",
        overflowY: "auto",
      }}
    >
      {/* Marquee banner */}
      <div
        style={{
          background: "#000",
          border: "3px ridge #ff0",
          marginBottom: "8px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          padding: "4px 0",
        }}
      >
        <span
          style={{
            display: "inline-block",
            animation: "ns-marquee 18s linear infinite",
            color: "#00ff00",
            fontFamily: "Courier New, monospace",
            fontSize: "13px",
          }}
        >
          ★★★ WELCOME TO MY HOMEPAGE!! ★★★ &nbsp;&nbsp;&nbsp; ✦ Best viewed at 800×600 in Netscape Navigator 4.0 ✦ &nbsp;&nbsp;&nbsp; ★★★ WELCOME TO MY HOMEPAGE!! ★★★ &nbsp;&nbsp;&nbsp; ✦ Best viewed at 800×600 in Netscape Navigator 4.0 ✦
        </span>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ fontSize: "28px", textShadow: "2px 2px #f00", fontWeight: "bold", color: "#ff0" }}>
          ✧ My Kewl HoMePaGe ✧
        </div>
        <div style={{ fontSize: "11px", color: "#00ffff" }}>
          ★ Est. 1997 · Last updated 4/20/99 ★
        </div>
      </div>

      {/* Under construction + hit counter row */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "12px", alignItems: "center" }}>
        <img
          src="/under_construction.png"
          alt="Under Construction"
          style={{ width: "88px", imageRendering: "pixelated", border: "2px solid #ff0" }}
        />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "#c0c0c0" }}>👁 You are visitor #</div>
          <div
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: "18px",
              color: "#00ff00",
              background: "#000",
              padding: "2px 8px",
              border: "2px inset #888",
              letterSpacing: "4px",
            }}
          >
            002048
          </div>
        </div>
        <div
          style={{
            animation: "ns-blink 1s steps(2) infinite",
            fontSize: "22px",
          }}
        >
          🚧
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "3px double #ff0", marginBottom: "10px" }} />

      {/* About me */}
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          border: "2px ridge #888",
          padding: "8px",
          marginBottom: "10px",
        }}
      >
        <div style={{ color: "#ff6600", fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
          ♦ About Me ♦
        </div>
        <p style={{ margin: "0 0 6px", color: "#fff", fontSize: "13px", lineHeight: 1.5 }}>
          Hi!! Welcome 2 my little corner of the WWW!! Im a web designer and total computer geek lol.
          I luv <span style={{ color: "#ff0" }}>HTML</span>, <span style={{ color: "#0ff" }}>Star Wars</span>,
          and listening to mp3z on Winamp. 🎵
        </p>
        <p style={{ margin: "0", color: "#fff", fontSize: "13px", lineHeight: 1.5 }}>
          This site is{" "}
          <span style={{ color: "#f00", fontWeight: "bold", animation: "ns-blink 1s steps(2) infinite", display: "inline-block" }}>
            ALWAYS UNDER CONSTRUCTION
          </span>{" "}
          so plz bear w/ me!! More stuff coming soooon!!!
        </p>
      </div>

      {/* Quick links nav */}
      <div
        style={{
          background: "rgba(0,0,128,0.5)",
          border: "2px groove #aaa",
          padding: "8px",
          marginBottom: "10px",
        }}
      >
        <div style={{ color: "#ff0", fontWeight: "bold", marginBottom: "6px" }}>⚡ Quick Links ⚡</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {([
            ["🔍 Search the Web", "search"],
            ["🔗 My Links & Socials", "links"],
            ["💼 View My Portfolio", "portfolio"],
          ] as [string, PageKey][]).map(([label, page]) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              style={{
                background: "none",
                border: "none",
                color: "#00ffff",
                textDecoration: "underline",
                cursor: "pointer",
                fontFamily: "Times New Roman, serif",
                fontSize: "13px",
                textAlign: "left",
                padding: 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Guestbook CTA */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <div style={{ color: "#ff6600", fontWeight: "bold", marginBottom: "4px" }}>📖 Sign My Guestbook!</div>
        <div style={{ color: "#c0c0c0", fontSize: "11px" }}>
          [Guestbook v2.3 — powered by CGI-bin]
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "3px double #ff0", paddingTop: "6px", textAlign: "center", fontSize: "10px", color: "#888" }}>
        © 1997–1999 &nbsp;|&nbsp; Best @ 800×600 &nbsp;|&nbsp; Netscape 4.0+ &nbsp;|&nbsp; No Frames plz
      </div>
    </div>
  );
}

// ─── Page 2 · Search98 Engine ─────────────────────────────────────────────────
function SearchPage({ navigate }: { navigate: (p: PageKey) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<null | "shown" | "category">(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [catEntries, setCatEntries] = useState<CatEntry[]>([]);

  const ROW1 = ["Arts", "Business", "Computers", "Games", "Health", "Home"];
  const ROW2 = ["News", "Recreation", "Reference", "Science", "Shopping", "Society"];

  const search = () => {
    if (query.trim()) { setResults("shown"); setActiveCat(null); }
  };
  const lucky = () => navigate("portfolio");

  // Pick a random entry from the category pool and show as a result listing
  const openCategory = (cat: string) => {
    const pool = CATEGORY_POOLS[cat] ?? [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setCatEntries(shuffled);
    setActiveCat(cat);
    setResults("category");
  };

  // Render a result row that navigates internally when clicked
  const ResultRow = ({ entry, urlLabel }: { entry: CatEntry; urlLabel: string }) => (
    <div style={{ marginBottom: "14px" }}>
      <div>
        <button
          onClick={() => navigate(`site:${entry.id}` as PageKey)}
          style={{ background: "none", border: "none", color: "#1a0dab", textDecoration: "underline", cursor: "pointer", fontSize: "15px", fontWeight: "bold", padding: 0, textAlign: "left" }}
        >
          {entry.label}
        </button>
      </div>
      <div style={{ color: "#006621", fontSize: "11px" }}>{urlLabel}</div>
      <div style={{ color: "#444", fontSize: "12px", marginTop: "2px" }}>{entry.desc}</div>
    </div>
  );

  const internalLinks = [
    { title: "💼 My Portfolio — Case Studies & Projects", url: "http://portfolio.local/work", desc: "A curated collection of web design and development work.", page: "portfolio" as PageKey },
    { title: "🔗 Links & Socials — GitHub, LinkedIn, Email", url: "http://webring.net/links", desc: "Connect on GitHub, LinkedIn, Twitter, and more.", page: "links" as PageKey },
  ];

  return (
    <div style={{ minHeight: "100%", background: "#fff", fontFamily: "Times New Roman, serif", padding: "8px", overflowY: "auto" }}>
      {/* Top nav strip */}
      <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "12px", display: "flex", gap: "12px", fontSize: "11px", color: "#00c" }}>
        {["Web", "Images", "Groups", "News", "Directory", "More »"].map(l => (
          <span key={l} style={{ cursor: "pointer", textDecoration: "underline" }}>{l}</span>
        ))}
      </div>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <div style={{ fontSize: "40px", fontWeight: "bold", fontFamily: "Arial Black, sans-serif", lineHeight: 1 }}>
          <span style={{ color: "#3c78d8" }}>S</span><span style={{ color: "#dc3545" }}>e</span>
          <span style={{ color: "#f4b400" }}>a</span><span style={{ color: "#3c78d8" }}>r</span>
          <span style={{ color: "#0f9d58" }}>c</span><span style={{ color: "#dc3545" }}>h</span>
          <span style={{ color: "#3c78d8" }}>9</span><span style={{ color: "#f4b400" }}>8</span>
        </div>
        <div style={{ fontSize: "10px", color: "#888", fontFamily: "sans-serif" }}>
          Searching 3.1 Million Pages on the World Wide Web!
        </div>
      </div>

      {/* Search box */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <input
          type="text" value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && search()}
          style={{ width: "320px", padding: "4px 6px", border: "1px solid #ccc", fontSize: "14px", fontFamily: "sans-serif", outline: "none" }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          {(["Search!", "I'm Feeling Lucky"] as const).map(label => (
            <button key={label} onClick={label === "Search!" ? search : lucky}
              style={{ background: "#c0c0c0", border: "2px outset #eee", padding: "3px 14px", fontFamily: "sans-serif", fontSize: "12px", cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category directory */}
      {results === null && (
        <div style={{ textAlign: "center", fontSize: "12px", fontFamily: "sans-serif" }}>
          {[ROW1, ROW2].map((row, ri) => (
            <div key={ri} style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "8px" }}>
              {row.map(cat => (
                <span key={cat} onClick={() => openCategory(cat)}
                  style={{ color: "#00c", textDecoration: "underline", cursor: "pointer" }}
                  title={`${CATEGORY_POOLS[cat]?.length ?? 0} sites`}>
                  {cat}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Category results — random retro site from the pool */}
      {results === "category" && activeCat && (
        <div style={{ fontFamily: "sans-serif", fontSize: "13px" }}>
          <div style={{ color: "#444", fontSize: "11px", marginBottom: "10px" }}>
            <span onClick={() => { setResults(null); setActiveCat(null); }}
              style={{ color: "#00c", textDecoration: "underline", cursor: "pointer" }}>← Directory</span>
            {" "}› {activeCat}
            <span onClick={() => openCategory(activeCat)}
              style={{ marginLeft: "12px", color: "#00c", textDecoration: "underline", cursor: "pointer", fontSize: "10px" }}>
              ↻ show others
            </span>
          </div>
          <div style={{ color: "#888", fontSize: "11px", marginBottom: "10px" }}>
            Search98 found about <b>{catEntries.length * 4291}</b> results for <b>"{activeCat}"</b>
          </div>
          <hr style={{ marginBottom: "10px" }} />
          {catEntries.map(e => (
            <ResultRow key={e.id} entry={e} urlLabel={RETRO_SITE_URLS[e.id]} />
          ))}
          {internalLinks.map(r => (
            <div key={r.title} style={{ marginBottom: "14px" }}>
              <button onClick={() => navigate(r.page)}
                style={{ background: "none", border: "none", color: "#1a0dab", textDecoration: "underline", cursor: "pointer", fontSize: "15px", fontWeight: "bold", padding: 0, textAlign: "left" }}>
                {r.title}
              </button>
              <div style={{ color: "#006621", fontSize: "11px" }}>{r.url}</div>
              <div style={{ color: "#444", fontSize: "12px", marginTop: "2px" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Generic search results — pick a random category's retro site */}
      {results === "shown" && (
        <div style={{ fontFamily: "sans-serif", fontSize: "13px" }}>
          <div style={{ color: "#444", fontSize: "11px", marginBottom: "8px" }}>
            <span onClick={() => { setResults(null); setQuery(""); }}
              style={{ color: "#00c", textDecoration: "underline", cursor: "pointer" }}>← Back</span>
          </div>
          <div style={{ color: "#888", fontSize: "11px", marginBottom: "10px" }}>
            Search98 found about <b>{Math.floor(Math.random() * 9000) + 1000}</b> results for <b>"{query}"</b> (0.{Math.floor(Math.random() * 89) + 10} seconds)
          </div>
          <hr style={{ marginBottom: "10px" }} />
          {Object.values(CATEGORY_POOLS).flat().sort(() => Math.random() - 0.5).slice(0, 3).map(e => (
            <ResultRow key={e.id} entry={e} urlLabel={RETRO_SITE_URLS[e.id]} />
          ))}
          {internalLinks.map(r => (
            <div key={r.title} style={{ marginBottom: "14px" }}>
              <button onClick={() => navigate(r.page)}
                style={{ background: "none", border: "none", color: "#1a0dab", textDecoration: "underline", cursor: "pointer", fontSize: "15px", fontWeight: "bold", padding: 0, textAlign: "left" }}>
                {r.title}
              </button>
              <div style={{ color: "#006621", fontSize: "11px" }}>{r.url}</div>
              <div style={{ color: "#444", fontSize: "12px", marginTop: "2px" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: "1px solid #ccc", marginTop: "16px", paddingTop: "6px", textAlign: "center", fontSize: "10px", color: "#888", fontFamily: "sans-serif" }}>
        ©1998 Search98 Inc. · Advertising · About · Privacy
      </div>
    </div>
  );
}


const CATEGORY_SITES: Record<string, SiteEntry[]> = {
  Arts: [
    { title: "Web Museum — Famous Paintings Online", url: "https://www.wga.hu", desc: "The Web Gallery of Art — thousands of European paintings from the 8th–19th century, fully searchable." },
    { title: "The Louvre — Collections Online", url: "https://collections.louvre.fr/en", desc: "Browse 480,000 artworks from the Musée du Louvre directly in your browser. Free access." },
    { title: "DeviantArt — Online Art Community", url: "https://www.deviantart.com", desc: "The world's largest online art community. Share and discover digital and traditional artwork." },
  ],
  Business: [
    { title: "Yahoo! Finance — Stock Quotes & News", url: "https://finance.yahoo.com", desc: "Real-time stock quotes, business news, financial data and portfolio management tools." },
    { title: "Inc. Magazine — Small Business Resources", url: "https://www.inc.com", desc: "Advice, tips, and resources for entrepreneurs and small business owners." },
    { title: "Entrepreneur.com — Start Your Business", url: "https://www.entrepreneur.com", desc: "Startup ideas, franchise info, business plans and marketing strategies for 1998 and beyond." },
  ],
  Computers: [
    { title: "Slashdot — News for Nerds", url: "https://slashdot.org", desc: "News for nerds, stuff that matters. Technology and open-source software discussion since 1997." },
    { title: "HowStuffWorks — Technology Explained", url: "https://computer.howstuffworks.com", desc: "Plain-English explanations of how computers, the internet, and technology actually work." },
    { title: "W3Schools — Web Tutorials", url: "https://www.w3schools.com", desc: "HTML, CSS, JavaScript, and web development tutorials. The beginner's guide to building websites." },
  ],
  Games: [
    { title: "GameFAQs — Game Guides & Cheats", url: "https://www.gamefaqs.com", desc: "Walkthroughs, FAQs, and cheat codes for thousands of games across all platforms." },
    { title: "IGN — Video Game News & Reviews", url: "https://www.ign.com", desc: "The latest video game reviews, previews, cheats, trailers, and news from IGN." },
    { title: "Miniclip — Free Online Games", url: "https://www.miniclip.com", desc: "Play hundreds of free online games directly in your browser. No download required." },
  ],
  Health: [
    { title: "WebMD — Medical Information", url: "https://www.webmd.com", desc: "Trusted medical information, symptom checkers, drug reference, and health news." },
    { title: "NIH — National Institutes of Health", url: "https://www.nih.gov", desc: "Official U.S. government health information from the National Institutes of Health." },
    { title: "Mayo Clinic — Patient Care & Health Info", url: "https://www.mayoclinic.org", desc: "Expert, reliable health and medical information from one of America's top hospitals." },
  ],
  Home: [
    { title: "This Old House — Home Improvement", url: "https://www.thisoldhouse.com", desc: "Expert advice on home improvement, remodeling, gardening, and home maintenance." },
    { title: "Better Homes & Gardens", url: "https://www.bhg.com", desc: "Ideas and inspiration for home décor, recipes, crafts, gardening, and entertaining." },
    { title: "Apartment Therapy — Home Design", url: "https://www.apartmenttherapy.com", desc: "Small-space living, budget decorating, and home tours from real people's homes." },
  ],
  News: [
    { title: "BBC News Online — World Service", url: "https://www.bbc.com/news", desc: "International news coverage from the British Broadcasting Corporation." },
    { title: "Reuters — Breaking News", url: "https://www.reuters.com", desc: "Real-time international news from Reuters wire service. Business, politics, world events." },
    { title: "The Guardian — News & Opinion", url: "https://www.theguardian.com", desc: "Independent journalism covering world news, politics, technology, sport and culture." },
  ],
  Recreation: [
    { title: "AllTrails — Hiking & Outdoor Maps", url: "https://www.alltrails.com", desc: "Find trails for hiking, biking, and running. Trail maps, photos, and reviews." },
    { title: "REI — Outdoor Gear & Adventures", url: "https://www.rei.com", desc: "Outdoor gear, clothing, and expert advice for hiking, camping, climbing, and more." },
    { title: "Roadtrippers — Trip Planning", url: "https://roadtrippers.com", desc: "Plan the perfect road trip with points of interest, campgrounds, and weird roadside attractions." },
  ],
  Reference: [
    { title: "Wikipedia — The Free Encyclopedia", url: "https://en.wikipedia.org", desc: "The world's largest free encyclopedia. Over 6 million articles in English." },
    { title: "Merriam-Webster — Dictionary & Thesaurus", url: "https://www.merriam-webster.com", desc: "America's most trusted dictionary since 1828. Word definitions, synonyms, and etymology." },
    { title: "Bartleby — Classic Literature & Reference", url: "https://www.bartleby.com", desc: "Free access to classic literature, poetry, quotations, encyclopedias and reference books." },
  ],
  Science: [
    { title: "NASA — Space Science & Exploration", url: "https://www.nasa.gov", desc: "Space exploration news, missions, astronomy images, and scientific research from NASA." },
    { title: "National Geographic — Science & Nature", url: "https://www.nationalgeographic.com", desc: "Photography, science, exploration, and stories about our world from National Geographic." },
    { title: "New Scientist — Science News", url: "https://www.newscientist.com", desc: "The latest science and technology news, analysis and expert comment from New Scientist." },
  ],
  Shopping: [
    { title: "Amazon.com — Books, Music & More", url: "https://www.amazon.com", desc: "Earth's biggest selection of books, CDs, videos, DVDs, toys, electronics and more." },
    { title: "eBay — Person-to-Person Auction Site", url: "https://www.ebay.com", desc: "Buy and sell anything! Collectibles, electronics, antiques, or just about anything else." },
    { title: "PriceWatch — Lowest PC Prices", url: "https://www.pricewatch.com", desc: "Compare prices on computer hardware, software, and electronics from hundreds of merchants." },
  ],
  Society: [
    { title: "MoveOn — Online Political Action", url: "https://www.moveon.org", desc: "Grassroots political action, petitions, and civic engagement tools for everyone." },
    { title: "Amnesty International", url: "https://www.amnesty.org", desc: "Human rights news, campaigns and actions from Amnesty International." },
    { title: "United Nations — Official Site", url: "https://www.un.org", desc: "International peace and security, humanitarian aid, and sustainable development from the UN." },
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function SearchPage({ navigate }: { navigate: (p: PageKey) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<null | "shown" | "category">(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [catSites, setCatSites] = useState<SiteEntry[]>([]);

  const search = () => {
    if (query.trim()) { setResults("shown"); setActiveCat(null); }
  };

  const lucky = () => navigate("portfolio");

  const openCategory = (cat: string) => {
    const pool = CATEGORY_SITES[cat];
    // Pick 2 random unique entries to show as results
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setCatSites(shuffled.slice(0, 2));
    setActiveCat(cat);
    setResults("category");
  };

  const ROW1 = ["Arts", "Business", "Computers", "Games", "Health", "Home"];
  const ROW2 = ["News", "Recreation", "Reference", "Science", "Shopping", "Society"];

  const resultBlock = (sites: SiteEntry[], label: string, count: number) => (
    <div style={{ fontFamily: "sans-serif", fontSize: "13px" }}>
      <div style={{ color: "#888", fontSize: "11px", marginBottom: "10px" }}>
        Search98 found about <b>{count}</b> results for <b>"{label}"</b> (0.{Math.floor(Math.random() * 89) + 10} seconds)
      </div>
      <hr style={{ marginBottom: "10px" }} />
      {sites.map(r => (
        <div key={r.url + r.title} style={{ marginBottom: "14px" }}>
          <div>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#1a0dab",
                textDecoration: "underline",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              {r.title}
            </a>
          </div>
          <div style={{ color: "#006621", fontSize: "11px" }}>{r.url}</div>
          <div style={{ color: "#444", fontSize: "12px", marginTop: "2px" }}>{r.desc}</div>
        </div>
      ))}
      {/* internal portfolio links always appended */}
      {[
        { title: "💼 My Portfolio — Case Studies & Projects", url: "http://portfolio.local/work", desc: "A curated collection of web design and development work.", page: "portfolio" as PageKey },
        { title: "🔗 Links & Socials — GitHub, LinkedIn, Email", url: "http://webring.net/links", desc: "Connect on GitHub, LinkedIn, Twitter, and more.", page: "links" as PageKey },
      ].map(r => (
        <div key={r.title} style={{ marginBottom: "14px" }}>
          <button
            onClick={() => navigate(r.page)}
            style={{ background: "none", border: "none", color: "#1a0dab", textDecoration: "underline", cursor: "pointer", fontSize: "15px", fontWeight: "bold", padding: 0, textAlign: "left" }}
          >
            {r.title}
          </button>
          <div style={{ color: "#006621", fontSize: "11px" }}>{r.url}</div>
          <div style={{ color: "#444", fontSize: "12px", marginTop: "2px" }}>{r.desc}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "100%", background: "#fff", fontFamily: "Times New Roman, serif", padding: "8px", overflowY: "auto" }}>
      {/* Top nav strip */}
      <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "12px", display: "flex", gap: "12px", fontSize: "11px", color: "#00c" }}>
        {["Web", "Images", "Groups", "News", "Directory", "More »"].map(l => (
          <span key={l} style={{ cursor: "pointer", textDecoration: "underline" }}>{l}</span>
        ))}
      </div>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <div style={{ fontSize: "40px", fontWeight: "bold", fontFamily: "Arial Black, sans-serif", lineHeight: 1 }}>
          <span style={{ color: "#3c78d8" }}>S</span>
          <span style={{ color: "#dc3545" }}>e</span>
          <span style={{ color: "#f4b400" }}>a</span>
          <span style={{ color: "#3c78d8" }}>r</span>
          <span style={{ color: "#0f9d58" }}>c</span>
          <span style={{ color: "#dc3545" }}>h</span>
          <span style={{ color: "#3c78d8" }}>9</span>
          <span style={{ color: "#f4b400" }}>8</span>
        </div>
        <div style={{ fontSize: "10px", color: "#888", fontFamily: "sans-serif" }}>
          Searching 3.1 Million Pages on the World Wide Web!
        </div>
      </div>

      {/* Search box */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && search()}
          style={{ width: "320px", padding: "4px 6px", border: "1px solid #ccc", fontSize: "14px", fontFamily: "sans-serif", outline: "none" }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          {(["Search!", "I'm Feeling Lucky"] as const).map(label => (
            <button
              key={label}
              onClick={label === "Search!" ? search : lucky}
              style={{ background: "#c0c0c0", border: "2px outset #eee", padding: "3px 14px", fontFamily: "sans-serif", fontSize: "12px", cursor: "pointer" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category directory — always visible when no search results */}
      {results === null && (
        <div style={{ textAlign: "center", fontSize: "12px", fontFamily: "sans-serif" }}>
          {[ROW1, ROW2].map((row, ri) => (
            <div key={ri} style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "8px" }}>
              {row.map(cat => (
                <span
                  key={cat}
                  onClick={() => openCategory(cat)}
                  style={{ color: "#00c", textDecoration: "underline", cursor: "pointer" }}
                  title={`${CATEGORY_SITES[cat].length} sites`}
                >
                  {cat}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Category results */}
      {results === "category" && activeCat && (
        <div>
          <div style={{ fontFamily: "sans-serif", fontSize: "11px", marginBottom: "10px", color: "#444" }}>
            <span
              onClick={() => { setResults(null); setActiveCat(null); }}
              style={{ color: "#00c", textDecoration: "underline", cursor: "pointer" }}
            >
              ← Directory
            </span>
            {" "}&rsaquo; {activeCat}
            <span
              onClick={() => openCategory(activeCat)}
              style={{ marginLeft: "12px", color: "#00c", textDecoration: "underline", cursor: "pointer", fontSize: "10px" }}
              title="Pick different sites"
            >
              ↻ show others
            </span>
          </div>
          {resultBlock(catSites, activeCat, CATEGORY_SITES[activeCat].length * 3412)}
        </div>
      )}

      {/* Search results */}
      {results === "shown" && (
        <div>
          <div style={{ fontFamily: "sans-serif", fontSize: "11px", marginBottom: "10px", color: "#444" }}>
            <span
              onClick={() => { setResults(null); setQuery(""); }}
              style={{ color: "#00c", textDecoration: "underline", cursor: "pointer" }}
            >
              ← Back
            </span>
          </div>
          {resultBlock(
            pickRandom(Object.values(CATEGORY_SITES)).slice(0, 2),
            query,
            Math.floor(Math.random() * 900) + 100,
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: "1px solid #ccc", marginTop: "16px", paddingTop: "6px", textAlign: "center", fontSize: "10px", color: "#888", fontFamily: "sans-serif" }}>
        ©1998 Search98 Inc. · Advertising · About · Privacy
      </div>
    </div>
  );
}


// ─── Page 3 · Webring Links Page ─────────────────────────────────────────────
const BADGE_STYLE: React.CSSProperties = {
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
  flexShrink: 0,
};

interface Badge {
  label: string;
  bg: string;
  color: string;
  href: string;
  accent?: string;
}

const BADGES: Badge[] = [
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
  { label: "No Frames!\nPlease", bg: "#444", color: "#fff", href: "#", accent: "#0f0" },
];

function LinksPage() {
  return (
    <div
      style={{
        minHeight: "100%",
        background: "#c0c0c0",
        fontFamily: "Times New Roman, serif",
        padding: "8px",
        overflowY: "auto",
      }}
    >
      {/* Page header */}
      <div
        style={{
          background: "#000080",
          color: "#fff",
          padding: "6px 10px",
          marginBottom: "10px",
          borderTop: "2px solid #fff",
          borderLeft: "2px solid #fff",
          borderRight: "2px solid #808080",
          borderBottom: "2px solid #808080",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>🌐 Links & Socials</div>
        <div style={{ fontSize: "10px", color: "#adf" }}>Netring member since 1997 · ID #4022</div>
      </div>

      <div style={{ fontSize: "12px", marginBottom: "8px" }}>
        Click any badge below to visit! All links open in a new window.
      </div>

      {/* Webring navigation */}
      <div
        style={{
          border: "2px groove #808080",
          background: "#d4d0c8",
          padding: "6px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11px",
          fontFamily: "sans-serif",
        }}
      >
        <button style={{ background: "#c0c0c0", border: "2px outset #fff", padding: "2px 10px", cursor: "pointer", fontSize: "11px" }}>◀ Prev</button>
        <div style={{ flex: 1, textAlign: "center", color: "#000080", fontWeight: "bold" }}>
          ✦ WebRing: Personal Homepages ✦
        </div>
        <button style={{ background: "#c0c0c0", border: "2px outset #fff", padding: "2px 10px", cursor: "pointer", fontSize: "11px" }}>Next ▶</button>
      </div>

      {/* Badge grid */}
      <div
        style={{
          border: "2px inset #808080",
          background: "#fff",
          padding: "10px",
          marginBottom: "12px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "8px", fontFamily: "sans-serif" }}>
          My Link Badges — Right-click to save!
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          {BADGES.map((b, i) => (
            <a
              key={i}
              href={b.href}
              target="_blank"
              rel="noreferrer"
              title={b.label.replace("\n", " ")}
              style={{
                ...BADGE_STYLE,
                background: b.bg,
                color: b.color,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  borderBottom: `2px solid ${b.accent ?? "#fff"}`,
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "9px",
                  paddingBottom: "1px",
                  marginBottom: "1px",
                }}
              >
                {b.label.split("\n")[0]}
              </div>
              <div style={{ fontSize: "8px" }}>{b.label.split("\n")[1]}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Socials list */}
      <div
        style={{
          border: "2px groove #808080",
          background: "#d4d0c8",
          padding: "8px",
          fontFamily: "sans-serif",
          fontSize: "12px",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "6px" }}>📬 Contact Me Directly</div>
        {([
          ["🐙 GitHub", "github.com/yourhandle", "https://github.com"],
          ["💼 LinkedIn", "linkedin.com/in/yourname", "https://linkedin.com"],
          ["🐦 Twitter / X", "@yourhandle", "https://twitter.com"],
          ["📧 Email", "you@example.com", "mailto:you@example.com"],
        ] as [string, string, string][]).map(([icon, label, href]) => (
          <div key={label} style={{ marginBottom: "4px" }}>
            <span style={{ minWidth: "80px", display: "inline-block" }}>{icon}</span>
            <a href={href} target="_blank" rel="noreferrer" style={{ color: "#000080" }}>{label}</a>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "10px", textAlign: "center", fontSize: "10px", color: "#666" }}>
        © 1998 My Netring Page · part of the{" "}
        <span style={{ color: "#000080", textDecoration: "underline", cursor: "pointer" }}>Personal Sites Webring</span>
      </div>
    </div>
  );
}

// ─── Page 4 · Modern Portfolio ────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "Webcore OS",
    year: "2024",
    tags: ["React", "TanStack Start", "TypeScript", "Vite"],
    desc: "A retro Win98-style desktop environment running entirely in the browser. Features a draggable window manager, Paint, Notepad, Calculator, Terminal, and Guestbook — all styled with authentic Windows 98 chrome.",
    link: "#",
    color: "#6366f1",
  },
  {
    title: "Design System Alpha",
    year: "2023",
    tags: ["CSS", "Storybook", "Tokens"],
    desc: "A zero-dependency design token system and component library spanning 40+ UI components. Built to be framework-agnostic and tree-shakeable.",
    link: "#",
    color: "#0ea5e9",
  },
  {
    title: "Real-time Collab Canvas",
    year: "2023",
    tags: ["WebSockets", "Canvas API", "Node.js"],
    desc: "A multiplayer whiteboard with live cursors, pressure-sensitive drawing, and persistent rooms. Handles 200+ concurrent users via CRDT-based sync.",
    link: "#",
    color: "#10b981",
  },
  {
    title: "CLI Scaffold Tool",
    year: "2022",
    tags: ["Bun", "TypeScript", "CLI"],
    desc: "A interactive project scaffolder that generates opinionated monorepo setups with CI, linting, and testing pre-configured. Published on npm.",
    link: "#",
    color: "#f59e0b",
  },
];

function PortfolioPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#0f0f13",
        color: "#e2e8f0",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflowY: "auto",
        padding: "0",
      }}
    >
      {/* Thin top banner — a wink at the retro wrapper */}
      <div
        style={{
          background: "#1e1e2e",
          borderBottom: "1px solid #2d2d44",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "#666",
        }}
      >
        <span>portfolio.local/work</span>
        <span style={{ color: "#4ade80", fontSize: "10px" }}>● LIVE</span>
      </div>

      {/* Hero */}
      <div
        style={{
          padding: "28px 20px 20px",
          background: "linear-gradient(135deg, #0f0f13 0%, #1a1a2e 100%)",
          borderBottom: "1px solid #1e1e2e",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: "10px",
            color: "#6366f1",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "20px",
            padding: "2px 10px",
            marginBottom: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Available for work
        </div>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            margin: "0 0 8px",
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
          }}
        >
          Hi, I'm{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Name
          </span>
        </h1>
        <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.6, maxWidth: "380px" }}>
          Frontend engineer obsessed with performance, accessibility, and occasionally wrapping modern
          interfaces inside retro Windows 98 chrome.
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["React", "TypeScript", "Node.js", "Bun", "CSS", "WebGL"].map(s => (
            <span
              key={s}
              style={{
                fontSize: "10px",
                background: "#1e1e2e",
                border: "1px solid #2d2d44",
                borderRadius: "4px",
                padding: "2px 8px",
                color: "#94a3b8",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ fontSize: "11px", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
          Selected Work
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                background: active === i ? "#1a1a2e" : "#141420",
                border: `1px solid ${active === i ? p.color + "55" : "#1e1e2e"}`,
                borderLeft: `3px solid ${p.color}`,
                borderRadius: "0 6px 6px 0",
                padding: "10px 14px",
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "#f1f5f9" }}>{p.title}</span>
                  <span style={{ fontSize: "10px", color: "#4a5568", marginLeft: "8px" }}>{p.year}</span>
                </div>
                <span style={{ fontSize: "12px", color: "#4a5568" }}>{active === i ? "▲" : "▼"}</span>
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {p.tags.map(t => (
                  <span
                    key={t}
                    style={{
                      fontSize: "9px",
                      color: p.color,
                      background: p.color + "18",
                      border: `1px solid ${p.color}33`,
                      borderRadius: "3px",
                      padding: "1px 5px",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {active === i && (
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "8px 0 0", lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          margin: "0 20px 20px",
          padding: "14px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(56,189,248,0.05))",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
          Let's build something great
        </div>
        <div style={{ fontSize: "11px", color: "#64748b" }}>
          you@example.com &nbsp;·&nbsp; github.com/yourhandle
        </div>
      </div>
    </div>
  );
}

// ─── Main Netscape Navigator Component ───────────────────────────────────────
export function NetscapeNavigator() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home");
  const [urlBar, setUrlBar] = useState<string>(PAGE_URLS["home"]);
  const [historyStack, setHistoryStack] = useState<PageKey[]>(["home"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateTo = useCallback((page: PageKey) => {
    setLoading(true);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      setCurrentPage(page);
      setUrlBar(PAGE_URLS[page]);
      setHistoryIdx(prevIdx => {
        setHistoryStack(h => [...h.slice(0, prevIdx + 1), page]);
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
      // fuzzy match
      const found = Object.keys(PAGES).find(k => k.toLowerCase().includes(trimmed.toLowerCase()));
      if (found) navigateTo(PAGES[found]);
    }
  };

  const canBack = historyIdx > 0;
  const canFwd = historyIdx < historyStack.length - 1;

  const toolbarBtnStyle: React.CSSProperties = {
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
    userSelect: "none",
  };

  const toolbarBtnDisabled: React.CSSProperties = {
    ...toolbarBtnStyle,
    color: "#808080",
    cursor: "default",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "#c0c0c0",
        fontFamily: "MS Sans Serif, Tahoma, sans-serif",
        fontSize: "12px",
      }}
    >
      {/* ── Menu bar ── */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          padding: "1px 4px",
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
          fontSize: "11px",
        }}
      >
        {["File", "Edit", "View", "Go", "Communicator", "Help"].map(m => (
          <span
            key={m}
            style={{ padding: "1px 6px", cursor: "default" }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = "#000080"; (e.target as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = ""; (e.target as HTMLElement).style.color = ""; }}
          >
            {m}
          </span>
        ))}
      </div>

      {/* ── Main Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "3px 4px",
          background: "#c0c0c0",
          borderBottom: "2px solid #808080",
          boxShadow: "inset 0 -1px 0 #fff",
        }}
      >
        {/* Back */}
        <button
          onClick={goBack}
          disabled={!canBack}
          style={canBack ? toolbarBtnStyle : toolbarBtnDisabled}
          title="Back"
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>◀</span>
          <span style={{ fontSize: "9px" }}>Back</span>
        </button>

        {/* Forward */}
        <button
          onClick={goForward}
          disabled={!canFwd}
          style={canFwd ? toolbarBtnStyle : toolbarBtnDisabled}
          title="Forward"
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>▶</span>
          <span style={{ fontSize: "9px" }}>Forward</span>
        </button>

        {/* Reload */}
        <button
          onClick={() => navigateTo(currentPage)}
          style={toolbarBtnStyle}
          title="Reload"
        >
          <span style={{ fontSize: "14px", lineHeight: 1 }}>↺</span>
          <span style={{ fontSize: "9px" }}>Reload</span>
        </button>

        {/* Home */}
        <button
          onClick={() => navigateTo("home")}
          style={toolbarBtnStyle}
          title="Home"
        >
          <span style={{ fontSize: "14px", lineHeight: 1 }}>🏠</span>
          <span style={{ fontSize: "9px" }}>Home</span>
        </button>

        {/* Separator */}
        <div style={{ width: "1px", height: "32px", background: "#808080", margin: "0 4px" }} />

        {/* Address bar row */}
        <span style={{ fontSize: "11px", whiteSpace: "nowrap", color: "#000" }}>Location:</span>
        <input
          type="text"
          value={urlBar}
          onChange={e => setUrlBar(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleGo(); }}
          style={{
            flex: 1,
            border: "2px inset #808080",
            padding: "2px 4px",
            fontFamily: "Courier New, monospace",
            fontSize: "11px",
            background: "#fff",
            outline: "none",
          }}
        />

        {/* Go button */}
        <button
          onClick={handleGo}
          style={{
            ...toolbarBtnStyle,
            fontWeight: "bold",
            padding: "4px 12px",
            fontSize: "11px",
          }}
        >
          Go!
        </button>
      </div>

      {/* ── Loading bar ── */}
      <div
        style={{
          height: "4px",
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
          overflow: "hidden",
        }}
      >
        {loading && (
          <div
            style={{
              height: "100%",
              background: "#000080",
              animation: "ns-progress 0.18s ease-out forwards",
            }}
          />
        )}
      </div>

      {/* ── Viewport ── */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          borderTop: "2px solid #808080",
          borderLeft: "2px solid #808080",
          borderRight: "2px solid #fff",
          borderBottom: "2px solid #fff",
          margin: "2px",
          background: "#fff",
          position: "relative",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(192,192,192,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              fontSize: "12px",
              color: "#000080",
              fontWeight: "bold",
            }}
          >
            Loading page...
          </div>
        )}

        {currentPage === "home" && <GeoHome navigate={navigateTo} />}
        {currentPage === "search" && <SearchPage navigate={navigateTo} />}
        {currentPage === "links" && <LinksPage />}
        {currentPage === "portfolio" && <PortfolioPage />}
        {currentPage.startsWith("site:") && (() => {
          const siteId = currentPage.slice(5) as RetroSiteId;
          const Renderer = RETRO_SITE_COMPONENTS[siteId];
          return Renderer ? <Renderer /> : <div style={{ padding: 12 }}>404 — Page not found.</div>;
        })()}
      </div>

      {/* ── Status bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1px 4px",
          background: "#c0c0c0",
          borderTop: "1px solid #808080",
          fontSize: "10px",
          gap: "8px",
          height: "18px",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px inset #808080",
            padding: "0 4px",
            height: "14px",
            lineHeight: "14px",
          }}
        >
          {loading ? `Opening ${urlBar}…` : `Document: Done`}
        </div>
        {/* Security icon */}
        <div style={{ border: "1px inset #808080", padding: "0 4px", height: "14px", lineHeight: "14px" }}>
          🔓
        </div>
        {/* Netscape N logo */}
        <div
          style={{
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
            border: "1px inset #000080",
          }}
        >
          N
        </div>
      </div>
    </div>
  );
}
