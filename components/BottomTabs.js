"use client";

export default function BottomTabs({ tab, setTab }) {
  return (
    <div className="tabsBar">
      <div className="tabsInner">
        <div className="tabsRow">
          <button
            className={`tabBtn ${tab === "home" ? "tabBtnActive" : ""}`}
            onClick={() => setTab("home")}
          >
            🎬 Browse
          </button>

          <button
            className={`tabBtn ${tab === "trending" ? "tabBtnActive" : ""}`}
            onClick={() => setTab("trending")}
          >
            ⚡ Latest
          </button>

          <button
            className={`tabBtn ${tab === "request" ? "tabBtnActive" : ""}`}
            onClick={() => setTab("request")}
          >
            📨 Request
          </button>
        </div>
      </div>
    </div>
  );
}
