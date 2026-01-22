"use client";

export default function BottomTabs({ tab, setTab }) {
  return (
    <div className="bottomTabs">
      <button
        className={`tabBtn ${tab === "home" ? "tabBtnActive" : ""}`}
        onClick={() => setTab("home")}
      >
        🎬 Movies
      </button>

      <button
        className={`tabBtn ${tab === "trending" ? "tabBtnActive" : ""}`}
        onClick={() => setTab("trending")}
      >
        🔞 Adult
      </button>

      <button
        className={`tabBtn ${tab === "request" ? "tabBtnActive" : ""}`}
        onClick={() => setTab("request")}
      >
        ✉️ Request
      </button>
    </div>
  );
}
