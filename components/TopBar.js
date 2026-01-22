"use client";

export default function TopBar({ query, setQuery }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="rowBetween">
        <div className="row" style={{ gap: 10 }}>
          <img
            src="/icon.png"
            alt="INZO"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)"
            }}
          />
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>INZO INFO</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Search • Watch Trailer • Download
            </div>
          </div>
        </div>

        <a href="/admin" className="btn btnPrimary">
          Admin
        </a>
      </div>

      <div style={{ height: 10 }} />

      <input
        className="input"
        placeholder="Search movies (example: pathan / patan)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
