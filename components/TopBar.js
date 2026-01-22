"use client";

export default function TopBar({ query, setQuery }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      {/* Center Logo */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 1000,
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(125, 95, 255, 0.22)",
              border: "1px solid rgba(255,255,255,0.14)"
            }}
          >
            🎬
          </span>
          <span>INZO INFO</span>
        </div>

        <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
          Search • Watch Trailer • Download
        </div>
      </div>

      <div style={{ height: 12 }} />

      {/* Full width search */}
      <input
        className="input"
        placeholder="Search movies (example: pathaan / patan)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
