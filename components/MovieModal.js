"use client";

import { useMemo, useState } from "react";
import DownloadModal from "./DownloadModal";

function getYouTubeEmbed(url) {
  if (!url) return "";
  try {
    // Support youtu.be and youtube.com links
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    }
  } catch (e) {}
  return "";
}

export default function MovieModal({ movie, onClose }) {
  const [downloadOpen, setDownloadOpen] = useState(false);

  const embed = useMemo(() => getYouTubeEmbed(movie?.trailer_url), [movie]);

  if (!movie) return null;

  return (
    <>
      <div className="modalOverlay" onClick={onClose}>
        <div className="modalSheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheetHeader">
            <div>
              <div className="sheetTitle">{movie.name}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                {movie.category}
              </div>
            </div>

            <button className="sheetClose" onClick={onClose}>
              ✕
            </button>
          </div>

          <div style={{ height: 12 }} />

          <div className="card" style={{ overflow: "hidden" }}>
            {embed ? (
              <iframe
                width="100%"
                height="240"
                src={embed}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ border: 0 }}
              />
            ) : (
              <div style={{ padding: 14 }} className="muted">
                Trailer link missing
              </div>
            )}
          </div>

          <div style={{ height: 12 }} />

          <div style={{ display: "grid", gap: 10 }}>
            <button
              className="btn btnPrimary"
              onClick={() => setDownloadOpen(true)}
            >
              ⬇️ Download
            </button>

            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      <DownloadModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        movie={movie}
      />
    </>
  );
                }
