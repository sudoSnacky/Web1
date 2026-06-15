import type React from "react";

// ─── Shared retro page shell ──────────────────────────────────────────────────
interface ShellProps {
  bg?: string;
  textColor?: string;
  linkColor?: string;
  title: string;
  tagline?: string;
  children: React.ReactNode;
}

function Shell({ bg = "#c0c0c0", textColor = "#000", title, tagline, children }: ShellProps) {
  return (
    <div style={{ minHeight: "100%", background: bg, color: textColor, fontFamily: "Times New Roman, serif", fontSize: "13px", padding: 0 }}>
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderBottom: "2px solid #808080" }}>
        <tbody>
          <tr style={{ background: "#000080" }}>
            <td style={{ padding: "8px 12px", color: "#fff", fontSize: "22px", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>
              {title}
            </td>
          </tr>
          {tagline && (
            <tr style={{ background: "#c0c0c0" }}>
              <td style={{ padding: "2px 12px", fontSize: "11px", color: "#444", fontFamily: "sans-serif", borderBottom: "1px solid #808080" }}>
                {tagline}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ padding: "10px 12px" }}>{children}</div>
    </div>
  );
}

function HR() {
  return <hr style={{ border: "none", borderTop: "2px solid #808080", margin: "8px 0" }} />;
}

function H2({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: "15px", fontWeight: "bold", fontFamily: "Arial, sans-serif", color: "#000080", marginBottom: "4px" }}>{children}</div>;
}

function BlueLink({ href, children }: { href?: string; children: React.ReactNode }) {
  return (
    <a href={href ?? "#"} target="_blank" rel="noreferrer" style={{ color: "#0000cc", textDecoration: "underline" }}>
      {children}
    </a>
  );
}

// ─── Individual site components ───────────────────────────────────────────────

export function Site_WebMuseum() {
  return (
    <Shell bg="#fffff0" title="WebMuseum Paris" tagline="Famous Paintings · Biographies · Guided Tours — Since 1993">
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <H2>🖼 Welcome to the WebMuseum!</H2>
          <p>The WebMuseum network, now running on 100 servers around the world! View thousands of famous artworks at no charge.</p>
          <HR />
          <H2>Featured Exhibitions</H2>
          <ul style={{ paddingLeft: "18px", lineHeight: 1.8 }}>
            <li><BlueLink>Paintings by Subject (3,200 works)</BlueLink></li>
            <li><BlueLink>Artist Biographies — from Botticelli to Warhol</BlueLink></li>
            <li><BlueLink>Virtual Tour: The Louvre, Paris</BlueLink></li>
            <li><BlueLink>Special Exhibition: Impressionism 1860–1900</BlueLink></li>
          </ul>
          <HR />
          <div style={{ fontSize: "11px", color: "#888", fontFamily: "sans-serif" }}>
            ★ Visitors since 1993: 14,281,003 ★ Mirror site count: 100
          </div>
        </div>
        <div style={{ width: "120px", border: "2px inset #808080", padding: "6px", fontSize: "11px", background: "#fff", textAlign: "center" }}>
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Quick Links</div>
          {["Artists A–Z", "Paintings", "Sculpture", "Architecture", "About"].map(l => (
            <div key={l}><BlueLink>{l}</BlueLink></div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Site_Yahoo_Finance() {
  const stocks = [
    { ticker: "MSFT", price: "87.19", change: "+1.42", up: true },
    { ticker: "AAPL", price: "28.72", change: "-0.55", up: false },
    { ticker: "AMZN", price: "6.21", change: "+0.88", up: true },
    { ticker: "IBM",  price: "112.44", change: "+0.10", up: true },
    { ticker: "AOL",  price: "55.37", change: "-2.10", up: false },
  ];
  return (
    <Shell bg="#fff" title="Yahoo! Finance" tagline="Your Money · Your Portfolio · Stock Quotes · News · Charts">
      <H2>Market Summary — Nasdaq Composite</H2>
      <table width="100%" cellPadding={3} style={{ border: "1px solid #ccc", borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: "12px" }}>
        <thead style={{ background: "#000080", color: "#fff" }}>
          <tr>
            {["Symbol", "Last Trade", "Change", "% Chg"].map(h => <th key={h} style={{ padding: "3px 6px", textAlign: "left" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, i) => (
            <tr key={s.ticker} style={{ background: i % 2 === 0 ? "#f0f0f0" : "#fff" }}>
              <td style={{ padding: "2px 6px", color: "#0000cc", textDecoration: "underline", cursor: "pointer" }}>{s.ticker}</td>
              <td style={{ padding: "2px 6px" }}>{s.price}</td>
              <td style={{ padding: "2px 6px", color: s.up ? "#006600" : "#cc0000" }}>{s.change}</td>
              <td style={{ padding: "2px 6px", color: s.up ? "#006600" : "#cc0000" }}>{s.up ? "▲" : "▼"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <HR />
      <H2>Today's Headlines</H2>
      <ul style={{ paddingLeft: "18px", lineHeight: 1.9, fontFamily: "sans-serif", fontSize: "12px" }}>
        <li><BlueLink>Microsoft reports record Q4 earnings — shares surge 6%</BlueLink></li>
        <li><BlueLink>Greenspan signals possible rate cut in September</BlueLink></li>
        <li><BlueLink>Amazon.com IPO: Should you buy? Analysts weigh in</BlueLink></li>
        <li><BlueLink>Dow Jones crosses 9,000 for first time</BlueLink></li>
      </ul>
    </Shell>
  );
}

export function Site_Slashdot() {
  const posts = [
    { title: "Linux Kernel 2.2 Released — Multithreading Improved", author: "CmdrTaco", comments: 412, time: "10:32 AM" },
    { title: "Netscape Releases Navigator 4.5 Source Code", author: "Hemos", comments: 887, time: "08:15 AM" },
    { title: "Ask Slashdot: Best Free Unix for Home Use?", author: "Roblimo", comments: 1203, time: "Yesterday" },
    { title: "Y2K Bug — Hype or Real Threat? Your Opinions", author: "CmdrTaco", comments: 2041, time: "Yesterday" },
  ];
  return (
    <Shell bg="#fff" title="Slashdot" tagline="News for Nerds — Stuff that Matters">
      {posts.map((p, i) => (
        <div key={i} style={{ marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px dotted #ccc" }}>
          <div>
            <BlueLink><b>{p.title}</b></BlueLink>
          </div>
          <div style={{ fontSize: "11px", color: "#888", fontFamily: "sans-serif", marginTop: "2px" }}>
            posted by <b>{p.author}</b> at {p.time} &nbsp;|&nbsp;
            <BlueLink>{p.comments} comments</BlueLink>
          </div>
        </div>
      ))}
      <HR />
      <div style={{ fontSize: "11px", fontFamily: "sans-serif", color: "#555" }}>
        Slashdot is hosted by Andover.Net · <BlueLink>Submit a Story</BlueLink> · <BlueLink>Advertise</BlueLink>
      </div>
    </Shell>
  );
}

export function Site_GameFAQs() {
  const games = [
    { name: "The Legend of Zelda: Ocarina of Time", system: "N64", guides: 42 },
    { name: "StarCraft", system: "PC", guides: 28 },
    { name: "Final Fantasy VII", system: "PS1", guides: 67 },
    { name: "Half-Life", system: "PC", guides: 15 },
    { name: "Pokémon Red / Blue", system: "GameBoy", guides: 53 },
  ];
  return (
    <Shell bg="#fffff0" title="GameFAQs" tagline="Game Guides, FAQs, Walkthroughs and Cheat Codes — Since 1995">
      <H2>📋 Most Popular FAQs This Week</H2>
      <table width="100%" cellPadding={3} style={{ borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: "12px" }}>
        <thead style={{ background: "#000080", color: "#fff" }}>
          <tr>
            <th style={{ padding: "3px 8px", textAlign: "left" }}>Game</th>
            <th style={{ padding: "3px 8px", textAlign: "left" }}>System</th>
            <th style={{ padding: "3px 8px", textAlign: "left" }}>Guides</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g, i) => (
            <tr key={g.name} style={{ background: i % 2 === 0 ? "#f5f5dc" : "#fff" }}>
              <td style={{ padding: "3px 8px" }}><BlueLink>{g.name}</BlueLink></td>
              <td style={{ padding: "3px 8px", color: "#555" }}>{g.system}</td>
              <td style={{ padding: "3px 8px", color: "#555" }}>{g.guides}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <HR />
      <div style={{ fontFamily: "sans-serif", fontSize: "11px" }}>
        <BlueLink>Submit a FAQ</BlueLink> &nbsp;·&nbsp; <BlueLink>Browse by Platform</BlueLink> &nbsp;·&nbsp; <BlueLink>Cheat Codes</BlueLink>
      </div>
    </Shell>
  );
}

export function Site_WebMD() {
  return (
    <Shell bg="#fff" title="WebMD Health" tagline="Better Information. Better Health. — Your trusted medical resource since 1996">
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <H2>🔍 Symptom Checker</H2>
          <div style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "10px", fontFamily: "sans-serif", fontSize: "12px" }}>
            <div style={{ marginBottom: "6px" }}>Enter your symptom:</div>
            <input style={{ border: "1px inset #808080", width: "180px", padding: "2px 4px", fontSize: "12px" }} placeholder="e.g. headache" readOnly />
            <button style={{ marginLeft: "6px", background: "#c0c0c0", border: "2px outset #eee", padding: "1px 10px", cursor: "pointer", fontSize: "11px" }}>Search</button>
          </div>
          <H2>Health News</H2>
          <ul style={{ paddingLeft: "18px", lineHeight: 1.9, fontFamily: "sans-serif", fontSize: "12px" }}>
            <li><BlueLink>New study links coffee to reduced heart disease risk</BlueLink></li>
            <li><BlueLink>FDA approves new antibiotic for respiratory infections</BlueLink></li>
            <li><BlueLink>Flu season: Are you prepared? Tips from the CDC</BlueLink></li>
          </ul>
        </div>
        <div style={{ width: "130px" }}>
          <div style={{ background: "#000080", color: "#fff", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Health Topics</div>
          {["Allergies", "Cancer", "Cold & Flu", "Diabetes", "Heart", "Mental Health", "Vitamins"].map(t => (
            <div key={t} style={{ fontSize: "11px" }}><BlueLink>{t}</BlueLink></div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Site_ThisOldHouse() {
  return (
    <Shell bg="#fffff8" title="This Old House" tagline="Expert Advice on Home Improvement, Remodeling & Repair — from PBS Television">
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <H2>🔨 Project of the Week</H2>
          <p><b>How to Install Hardwood Floors — Step by Step</b></p>
          <p style={{ fontFamily: "sans-serif", fontSize: "12px" }}>
            Refinishing your hardwood floors can add thousands to your home's value. Master carpenter Norm Abram walks you through the entire process from prep to finish.
          </p>
          <BlueLink>Read the full guide »</BlueLink>
          <HR />
          <H2>Ask Norm!</H2>
          <p style={{ fontFamily: "sans-serif", fontSize: "12px" }}>
            "My basement keeps flooding every spring. What's the best way to waterproof it without digging up the foundation?"
          </p>
          <div style={{ fontSize: "11px", fontStyle: "italic" }}>— Dave from Ohio</div>
          <BlueLink>See Norm's answer »</BlueLink>
        </div>
        <div style={{ width: "120px" }}>
          <div style={{ background: "#8b4513", color: "#fff", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Projects</div>
          {["Plumbing", "Electrical", "Roofing", "Kitchens", "Bathrooms", "Landscaping"].map(t => (
            <div key={t} style={{ fontSize: "11px" }}><BlueLink>{t}</BlueLink></div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Site_BBC_News() {
  const stories = [
    { time: "15:42 GMT", headline: "Clinton addresses Congress on economic surplus" },
    { time: "14:20 GMT", headline: "Euro currency preparations in final stage across 11 nations" },
    { time: "13:05 GMT", headline: "Scientists clone first mammal — Dolly the sheep update" },
    { time: "11:30 GMT", headline: "England cricket team prepares for Ashes series" },
    { time: "09:44 GMT", headline: "Y2K: Is your bank ready? What savers need to know" },
  ];
  return (
    <Shell bg="#fff" title="BBC News Online" tagline="World Service · UK · Technology · Sport · Entertainment — Updated Every 10 Minutes">
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <H2>Latest Headlines</H2>
          {stories.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontFamily: "sans-serif", fontSize: "12px" }}>
              <span style={{ color: "#888", minWidth: "70px", flexShrink: 0 }}>{s.time}</span>
              <BlueLink>{s.headline}</BlueLink>
            </div>
          ))}
          <HR />
          <BlueLink>Full World Service News →</BlueLink>
        </div>
        <div style={{ width: "120px" }}>
          <div style={{ background: "#bb0000", color: "#fff", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Sections</div>
          {["UK", "World", "Politics", "Business", "Science", "Health", "Sport", "Entertainment"].map(t => (
            <div key={t} style={{ fontSize: "11px" }}><BlueLink>{t}</BlueLink></div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Site_AllTrails() {
  const trails = [
    { name: "Appalachian Trail — White Mountains Section", dist: "22 mi", diff: "Hard", rating: "★★★★★" },
    { name: "Grand Canyon — South Rim Rim Trail", dist: "13 mi", diff: "Easy", rating: "★★★★☆" },
    { name: "Yosemite — Half Dome via John Muir Trail", dist: "16 mi", diff: "Hard", rating: "★★★★★" },
  ];
  return (
    <Shell bg="#f5fff5" title="TrailFinder Online" tagline="Hike It. Love It. Share It. — 10,000+ Trails Nationwide">
      <H2>🥾 Popular Trails Near You</H2>
      <table width="100%" cellPadding={4} style={{ borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: "12px" }}>
        <thead style={{ background: "#006600", color: "#fff" }}>
          <tr>
            {["Trail Name", "Distance", "Difficulty", "Rating"].map(h => <th key={h} style={{ padding: "3px 8px", textAlign: "left" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {trails.map((t, i) => (
            <tr key={t.name} style={{ background: i % 2 === 0 ? "#e8f5e8" : "#fff" }}>
              <td style={{ padding: "3px 8px" }}><BlueLink>{t.name}</BlueLink></td>
              <td style={{ padding: "3px 8px" }}>{t.dist}</td>
              <td style={{ padding: "3px 8px", color: t.diff === "Hard" ? "#cc0000" : "#006600" }}>{t.diff}</td>
              <td style={{ padding: "3px 8px" }}>{t.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <HR />
      <H2>Trail Tips</H2>
      <ul style={{ paddingLeft: "18px", lineHeight: 1.8, fontFamily: "sans-serif", fontSize: "12px" }}>
        <li>Always tell someone where you are going</li>
        <li>Carry at least 2 liters of water per person</li>
        <li><BlueLink>Download our FREE printable trail maps (PDF)</BlueLink></li>
      </ul>
    </Shell>
  );
}

export function Site_Wikipedia() {
  return (
    <Shell bg="#fff" title="Nupedia — The Free Encyclopedia" tagline="The Open Encyclopedia That Anyone Can Edit — Est. 1999">
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ border: "1px solid #aaa", padding: "8px", marginBottom: "10px", background: "#f9f9f9", fontFamily: "sans-serif", fontSize: "12px" }}>
            <b>Search the encyclopedia:</b><br />
            <input style={{ border: "1px inset #808080", width: "200px", padding: "2px 4px", marginTop: "4px", fontSize: "12px" }} placeholder="Article title" readOnly />
            <button style={{ marginLeft: "6px", background: "#c0c0c0", border: "2px outset #eee", padding: "1px 10px", cursor: "pointer", fontSize: "11px" }}>Go</button>
          </div>
          <H2>Featured Article: World Wide Web</H2>
          <p style={{ fontFamily: "sans-serif", fontSize: "12px", lineHeight: 1.6 }}>
            The <b>World Wide Web</b> (also called the <b>Web</b>) is an information space in which the items of interest, referred to as resources, are identified by global identifiers called Uniform Resource Locators (URLs)...
          </p>
          <BlueLink>Read more →</BlueLink>
          <HR />
          <H2>Recently Updated Articles</H2>
          <ul style={{ paddingLeft: "18px", lineHeight: 1.9, fontFamily: "sans-serif", fontSize: "12px" }}>
            {["Y2K Problem", "Napster (software)", "Euro currency", "International Space Station", "Human Genome Project"].map(a => (
              <li key={a}><BlueLink>{a}</BlueLink></li>
            ))}
          </ul>
        </div>
        <div style={{ width: "120px" }}>
          <div style={{ background: "#000080", color: "#fff", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Browse</div>
          {["Arts", "History", "Science", "Geography", "People", "Technology", "Sports"].map(t => (
            <div key={t} style={{ fontSize: "11px" }}><BlueLink>{t}</BlueLink></div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Site_NASA() {
  return (
    <Shell bg="#000020" textColor="#fff" title="NASA — National Aeronautics and Space Administration" tagline="Exploring The Universe · For The Benefit of All">
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <H2>🚀 Mission News</H2>
          <ul style={{ paddingLeft: "18px", lineHeight: 1.9, color: "#7df", fontFamily: "sans-serif", fontSize: "12px" }}>
            {[
              "Mars Pathfinder Mission — Week 14 update",
              "Hubble Space Telescope: New images of Crab Nebula released",
              "STS-95 Shuttle Mission — John Glenn returns to space",
              "International Space Station — Module Alpha delivered",
            ].map(n => <li key={n}><a href="#" style={{ color: "#7df", textDecoration: "underline" }}>{n}</a></li>)}
          </ul>
          <HR />
          <div style={{ background: "#000040", border: "1px solid #00f", padding: "8px", fontFamily: "sans-serif", fontSize: "11px", color: "#adf" }}>
            <div style={{ fontWeight: "bold", color: "#ff0", marginBottom: "4px" }}>🌌 Picture of the Day</div>
            <div style={{ width: "100%", height: "60px", background: "linear-gradient(135deg, #000020, #000080, #200040)", display: "flex", alignItems: "center", justifyContent: "center", color: "#adf", fontSize: "10px", border: "1px solid #00f" }}>
              [Hubble Deep Field Image]
            </div>
            <div style={{ marginTop: "4px" }}>Hubble Ultra Deep Field — 10,000 galaxies in one image</div>
          </div>
        </div>
        <div style={{ width: "120px" }}>
          <div style={{ background: "#000080", color: "#7df", padding: "4px 6px", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Centers</div>
          {["JPL", "JSC Houston", "Kennedy", "Goddard", "Ames", "Marshall"].map(t => (
            <div key={t} style={{ fontSize: "11px" }}><a href="#" style={{ color: "#7df", textDecoration: "underline" }}>{t}</a></div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Site_Amazon() {
  const books = [
    { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", price: "$12.99" },
    { title: "The World Is Flat", author: "Thomas L. Friedman", price: "$14.99" },
    { title: "Men Are from Mars, Women Are from Venus", author: "John Gray", price: "$10.99" },
  ];
  return (
    <Shell bg="#fff" title="Amazon.com" tagline="Earth's Biggest Bookstore — Books, Music, VHS, and More!">
      <div style={{ fontFamily: "sans-serif", fontSize: "12px", border: "1px solid #ccc", padding: "6px", marginBottom: "10px", background: "#fffde7" }}>
        <b>Search:</b>
        <select style={{ marginLeft: "6px", fontSize: "11px", border: "1px solid #808080" }}>
          <option>Books</option><option>Music</option><option>Videos</option>
        </select>
        <input style={{ marginLeft: "6px", border: "1px inset #808080", width: "160px", padding: "2px 4px", fontSize: "12px" }} placeholder="" readOnly />
        <button style={{ marginLeft: "6px", background: "#ff9900", border: "2px outset #ffcc66", padding: "1px 10px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>Go!</button>
      </div>
      <H2>📚 Bestsellers This Week</H2>
      <table width="100%" cellPadding={4} style={{ borderCollapse: "collapse", fontSize: "12px" }}>
        {books.map((b, i) => (
          <tr key={b.title} style={{ background: i % 2 === 0 ? "#fff8f0" : "#fff", borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "4px 6px" }}><BlueLink>{b.title}</BlueLink><br /><span style={{ color: "#888" }}>{b.author}</span></td>
            <td style={{ padding: "4px 6px", color: "#900", fontWeight: "bold", textAlign: "right" }}>{b.price}</td>
          </tr>
        ))}
      </table>
      <HR />
      <div style={{ fontSize: "11px", color: "#555" }}>
        &copy;1998 Amazon.com, Inc. · <BlueLink>Shopping Cart</BlueLink> · <BlueLink>Your Account</BlueLink> · 1-Click Ordering™
      </div>
    </Shell>
  );
}

export function Site_MoveOn() {
  return (
    <Shell bg="#fff" title="MoveOn.org Political Action" tagline="Democracy in Action — Civic Petitions · Grassroots Campaigns · Get Involved">
      <H2>📢 Active Campaigns</H2>
      <div style={{ fontFamily: "sans-serif", fontSize: "12px" }}>
        {[
          { title: "Stop Campaign Finance Corruption — Sign the Petition", sigs: "142,088 signatures" },
          { title: "Save Public Broadcasting — Oppose Budget Cuts", sigs: "98,441 signatures" },
          { title: "Clean Air Act: Tell Congress to Act Now", sigs: "204,991 signatures" },
        ].map(c => (
          <div key={c.title} style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px", background: "#f8f8ff" }}>
            <div><BlueLink><b>{c.title}</b></BlueLink></div>
            <div style={{ color: "#006600", marginTop: "2px" }}>✔ {c.sigs}</div>
            <button style={{ marginTop: "4px", background: "#000080", color: "#fff", border: "none", padding: "2px 10px", cursor: "pointer", fontSize: "11px" }}>
              Add Your Name
            </button>
          </div>
        ))}
      </div>
      <HR />
      <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#555" }}>
        MoveOn.org is a 501(c)(4) nonprofit organization. &copy;1998 MoveOn.org PAC
      </div>
    </Shell>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────
export type RetroSiteId =
  | "webmuseum" | "yahoo_finance" | "slashdot" | "gamefaqs" | "webmd"
  | "thisoldhouse" | "bbc" | "alltrails" | "wikipedia" | "nasa"
  | "amazon" | "moveon";

export const RETRO_SITE_COMPONENTS: Record<RetroSiteId, () => React.ReactElement> = {
  webmuseum:    () => <Site_WebMuseum />,
  yahoo_finance: () => <Site_Yahoo_Finance />,
  slashdot:     () => <Site_Slashdot />,
  gamefaqs:     () => <Site_GameFAQs />,
  webmd:        () => <Site_WebMD />,
  thisoldhouse: () => <Site_ThisOldHouse />,
  bbc:          () => <Site_BBC_News />,
  alltrails:    () => <Site_AllTrails />,
  wikipedia:    () => <Site_Wikipedia />,
  nasa:         () => <Site_NASA />,
  amazon:       () => <Site_Amazon />,
  moveon:       () => <Site_MoveOn />,
};

export const RETRO_SITE_URLS: Record<RetroSiteId, string> = {
  webmuseum:    "http://www.webmuseum.paris.org",
  yahoo_finance: "http://finance.yahoo.com",
  slashdot:     "http://slashdot.org",
  gamefaqs:     "http://www.gamefaqs.com",
  webmd:        "http://www.webmd.com",
  thisoldhouse: "http://www.thisoldhouse.com",
  bbc:          "http://news.bbc.co.uk",
  alltrails:    "http://www.trailfinder.com",
  wikipedia:    "http://www.nupedia.com",
  nasa:         "http://www.nasa.gov",
  amazon:       "http://www.amazon.com",
  moveon:       "http://www.moveon.org",
};

// ─── Category → site pool mapping ─────────────────────────────────────────────
export interface CatEntry {
  id: RetroSiteId;
  label: string;
  desc: string;
}

export const CATEGORY_POOLS: Record<string, CatEntry[]> = {
  Arts: [
    { id: "webmuseum", label: "WebMuseum Paris — Famous Paintings Online", desc: "Thousands of European paintings from the 8th–19th century, searchable by artist or period." },
  ],
  Business: [
    { id: "yahoo_finance", label: "Yahoo! Finance — Stock Quotes & Business News", desc: "Real-time market data, stock quotes, portfolio tools, and business headlines." },
  ],
  Computers: [
    { id: "slashdot", label: "Slashdot — News for Nerds, Stuff that Matters", desc: "Open-source software, tech policy, and nerd culture discussion since 1997." },
  ],
  Games: [
    { id: "gamefaqs", label: "GameFAQs — Game Guides, FAQs & Cheats", desc: "Walkthroughs, FAQs, and cheat codes for N64, PlayStation, PC, and more." },
  ],
  Health: [
    { id: "webmd", label: "WebMD Health — Symptom Checker & News", desc: "Trusted medical information and symptom lookup. Ask a doctor online." },
  ],
  Home: [
    { id: "thisoldhouse", label: "This Old House — Home Improvement Advice", desc: "Expert advice on remodeling, plumbing, electrical and gardening from the PBS show." },
  ],
  News: [
    { id: "bbc", label: "BBC News Online — World Service", desc: "International and UK news, sports, science and entertainment updated every 10 minutes." },
  ],
  Recreation: [
    { id: "alltrails", label: "TrailFinder — Hiking & Outdoor Recreation", desc: "10,000+ trail guides for hiking, camping, and outdoor adventures across North America." },
  ],
  Reference: [
    { id: "wikipedia", label: "Nupedia — The Free Online Encyclopedia", desc: "The world's largest volunteer-written encyclopedia. Browse or search millions of articles." },
  ],
  Science: [
    { id: "nasa", label: "NASA.gov — Space Exploration & Science", desc: "Mission news, Hubble images, Mars rover updates, and space science for everyone." },
  ],
  Shopping: [
    { id: "amazon", label: "Amazon.com — Earth's Biggest Bookstore", desc: "Books, music, VHS, and more. 1-Click ordering. Ships anywhere in the USA." },
  ],
  Society: [
    { id: "moveon", label: "MoveOn.org — Online Political Action", desc: "Sign petitions, join campaigns, and make your voice heard in democracy." },
  ],
};
