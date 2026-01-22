"use client";

export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import TopBar from "../components/TopBar";
import BottomTabs from "../components/BottomTabs";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import RequestModal from "../components/RequestModal";
import { supabase } from "../Lib/supabaseClient";
import { fuzzyIncludes } from "../Lib/fuzzySearch";

export default function HomePage() {
  const [tab, setTab] = useState("home"); // home | trending | request
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [activeMovie, setActiveMovie] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);

  async function loadMovies() {
    setLoading(true);
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMovies(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (tab === "request") setRequestOpen(true);
  }, [tab]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return movies;

    return movies.filter((m) => {
      return (
        fuzzyIncludes(m.title || "", q) ||
        fuzzyIncludes(m.category || "", q)
      );
    });
  }, [movies, query]);

  const trendingLatest = useMemo(() => {
    return movies.slice(0, 12);
  }, [movies]);

  return (
    <>
      <div className="container">
        <TopBar query={query} setQuery={setQuery} />

        <div className="rowBetween" style={{ marginTop: 12 }}>
          <div className="badge">
            <span>⚡</span>
            <span>
              {loading ? "Loading..." : `${movies.length} Movies`}
            </span>
          </div>

          <div className="badge">
            <span>🟣</span>
            <span>Poster Upload Enabled</span>
          </div>
        </div>

        <div className="hr" />

        {tab === "home" && (
          <>
            <div className="rowBetween">
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>
                  Browse Movies
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Tap any card to open details & download.
                </div>
              </div>
              <button className="btn" onClick={loadMovies}>
                🔄 Refresh
              </button>
            </div>

            <div style={{ height: 12 }} />

            {loading ? (
              <div className="muted">Loading movies from Supabase...</div>
            ) : filtered.length === 0 ? (
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontWeight: 900 }}>No movies found</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Try a different search keyword.
                </div>
              </div>
            ) : (
              <div className="grid">
                {filtered.map((m) => (
                  <MovieCard key={m.id} movie={m} onOpen={() => setActiveMovie(m)} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "trending" && (
          <>
            <div className="rowBetween">
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>
                  Trending (Latest)
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Latest uploaded movies show here.
                </div>
              </div>
              <div className="kbd">Latest</div>
            </div>

            <div style={{ height: 12 }} />

            <div className="grid">
              {trendingLatest.map((m) => (
                <MovieCard key={m.id} movie={m} onOpen={() => setActiveMovie(m)} />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomTabs
        tab={tab}
        setTab={(t) => {
          if (t === "request") setRequestOpen(true);
          setTab(t);
        }}
      />

      <MovieModal
        movie={activeMovie}
        onClose={() => setActiveMovie(null)}
      />

      <RequestModal
        open={requestOpen}
        onClose={() => {
          setRequestOpen(false);
          if (tab === "request") setTab("home");
        }}
      />
    </>
  );
              }
