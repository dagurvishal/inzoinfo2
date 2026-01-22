
"use client";

import { useState } from "react";
import { supabase } from "../../Lib/supabaseClient";
import { formatCategory, isValidUrl } from "../../Lib/helpers";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("BOLLYWOOD");
  const [trailerUrl, setTrailerUrl] = useState("");

  const [download480, setDownload480] = useState("");
  const [download720, setDownload720] = useState("");
  const [download1080, setDownload1080] = useState("");
  const [download4k, setDownload4k] = useState("");

  const [posterFile, setPosterFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // IMPORTANT: /admin? issue fix
    setMsg("");

    if (!name.trim()) {
      setMsg("Movie name required ❌");
      return;
    }

    if (!posterFile) {
      setMsg("Poster upload required ❌");
      return;
    }

    if (!trailerUrl.trim() || !isValidUrl(trailerUrl.trim())) {
      setMsg("Valid trailer URL required ❌");
      return;
    }

    // At least 1 download link required
    const hasAnyDownload =
      download480.trim() ||
      download720.trim() ||
      download1080.trim() ||
      download4k.trim();

    if (!hasAnyDownload) {
      setMsg("At least 1 download link required ❌");
      return;
    }

    setLoading(true);

    try {
      // 1) Upload poster to Supabase bucket: posters
      const ext = posterFile.name.split(".").pop();
      const filePath = `poster_${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("posters")
        .upload(filePath, posterFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from("posters").getPublicUrl(filePath);
      const posterUrl = pub?.publicUrl;

      if (!posterUrl) throw new Error("Poster public URL missing");

      // 2) Insert movie into DB
      const payload = {
        name: name.trim(),
        category: formatCategory(category),
        poster_url: posterUrl,
        trailer_url: trailerUrl.trim(),
        download_url: download720.trim() || download480.trim() || download1080.trim() || download4k.trim(),
        download_480: download480.trim() || null,
        download_720: download720.trim() || null,
        download_1080: download1080.trim() || null,
        download_4k: download4k.trim() || null
      };

      const { error: insertErr } = await supabase.from("movies").insert([payload]);

      if (insertErr) throw insertErr;

      setMsg("Movie uploaded ✅");
      setName("");
      setTrailerUrl("");
      setDownload480("");
      setDownload720("");
      setDownload1080("");
      setDownload4k("");
      setPosterFile(null);
    } catch (err) {
      setMsg("Upload failed ❌");
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <div className="card" style={{ padding: 14 }}>
        <div className="rowBetween">
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>Admin Upload</div>
            <div className="muted" style={{ fontSize: 13 }}>
              Poster upload + trailer + quality links
            </div>
          </div>

          <a className="btn" href="/">
            ⬅ Back
          </a>
        </div>

        <div className="hr" />

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            className="input"
            placeholder="Movie Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="BOLLYWOOD">BOLLYWOOD</option>
            <option value="HOLLYWOOD">HOLLYWOOD</option>
            <option value="ADULT">ADULT / 18+</option>
          </select>

          <input
            className="input"
            placeholder="YouTube Trailer URL"
            value={trailerUrl}
            onChange={(e) => setTrailerUrl(e.target.value)}
          />

          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Download Links</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Blank रहेगा तो button disabled दिखेगा
            </div>

            <div style={{ height: 10 }} />

            <div style={{ display: "grid", gap: 10 }}>
              <input
                className="input"
                placeholder="480p Link"
                value={download480}
                onChange={(e) => setDownload480(e.target.value)}
              />
              <input
                className="input"
                placeholder="720p Link"
                value={download720}
                onChange={(e) => setDownload720(e.target.value)}
              />
              <input
                className="input"
                placeholder="1080p Link"
                value={download1080}
                onChange={(e) => setDownload1080(e.target.value)}
              />
              <input
                className="input"
                placeholder="4K Link"
                value={download4k}
                onChange={(e) => setDownload4k(e.target.value)}
              />
            </div>
          </div>

          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontWeight: 900 }}>Poster Upload</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Poster URL नहीं — upload required
            </div>

            <div style={{ height: 10 }} />

            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
            />
          </div>

          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Submit Movie"}
          </button>

          {msg ? (
            <div className="muted" style={{ fontWeight: 900 }}>
              {msg}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
                }
