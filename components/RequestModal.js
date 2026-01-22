"use client";

import { useState } from "react";
import { supabase } from "../Lib/supabaseClient";

export default function RequestModal({ open, onClose }) {
  const [movieName, setMovieName] = useState("");
  const [movieUrl, setMovieUrl] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!open) return null;

  async function handleSend() {
    if (!movieName.trim()) {
      setMsg("Movie name required!");
      return;
    }

    setLoading(true);
    setMsg("");

    let photoUrl = "";

    try {
      // Upload request photo (optional)
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const filePath = `req_${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("requests")
          .upload(filePath, photoFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadErr) throw uploadErr;

        const { data: pub } = supabase.storage
          .from("requests")
          .getPublicUrl(filePath);

        photoUrl = pub?.publicUrl || "";
      }

      // Insert into Supabase requests table
      const { error: dbErr } = await supabase.from("requests").insert([
        {
          movie_name: movieName.trim(),
          movie_url: movieUrl.trim() || null,
          photo_url: photoUrl || null,
          user_query: movieName.trim()
        }
      ]);

      if (dbErr) throw dbErr;

      // Send to Telegram (server route)
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieName: movieName.trim(),
          movieUrl: movieUrl.trim(),
          photoUrl: photoUrl
        })
      });

      setMsg("Request sent ✅");
      setMovieName("");
      setMovieUrl("");
      setPhotoFile(null);
    } catch (e) {
      setMsg("Failed ❌");
    }

    setLoading(false);
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalSheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheetHeader">
          <div>
            <div className="sheetTitle">Request Movie</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
              Photo + Name + URL Telegram pe aayega
            </div>
          </div>

          <button className="sheetClose" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ height: 12 }} />

        <div style={{ display: "grid", gap: 10 }}>
          <input
            className="input"
            placeholder="Movie name (example: Pathaan)"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Movie URL (optional)"
            value={movieUrl}
            onChange={(e) => setMovieUrl(e.target.value)}
          />

          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          />

          <button
            className="btn btnPrimary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Request"}
          </button>

          {msg ? (
            <div className="muted" style={{ fontWeight: 800 }}>
              {msg}
            </div>
          ) : null}

          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
              }
