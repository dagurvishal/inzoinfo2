"use client";

export default function DownloadModal({ open, onClose, movie }) {
  if (!open || !movie) return null;

  const links = [
    { label: "480p", url: movie.download_480 || "" },
    { label: "720p", url: movie.download_720 || "" },
    { label: "1080p", url: movie.download_1080 || "" },
    { label: "4K", url: movie.download_4k || "" }
  ];

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalSheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheetHeader">
          <div>
            <div className="sheetTitle">Select Quality</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
              Disabled दिखेगा अगर link नहीं है
            </div>
          </div>

          <button className="sheetClose" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ height: 12 }} />

        <div style={{ display: "grid", gap: 10 }}>
          {links.map((x) => {
            const disabled = !x.url;
            return (
              <button
                key={x.label}
                className="btn btnPrimary"
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  window.location.href = x.url;
                }}
              >
                {x.label} {disabled ? " (Disabled)" : ""}
              </button>
            );
          })}
        </div>

        <div style={{ height: 10 }} />

        <button className="btn" onClick={onClose} style={{ width: "100%" }}>
          Close
        </button>
      </div>
    </div>
  );
}
