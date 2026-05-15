import { useState, useMemo, useCallback } from "react";
import episodes from "./episodes.json";
import Filters from "./components/Filters";
import EpisodeCard from "./components/EpisodeCard";
import "./App.css";

const LEVEL_ORDER = { Low: 1, Moderate: 2, High: 3 };

const DEFAULT_FILTERS = {
  search: "",
  seasonFrom: 1,
  seasonTo: 36,
  minQuality: null,
  ageRating: null,
  violence: null,
  language: null,
  sexualContent: null,
  matureThemes: null,
  sacrilege: null,
  favoritesOnly: false,
};

function meetsMaxLevel(episodeLevel, filterLevel) {
  if (!filterLevel) return true;
  if (!episodeLevel) return true;
  return LEVEL_ORDER[episodeLevel] <= LEVEL_ORDER[filterLevel];
}

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return episodes.filter((ep) => {
      if (ep.season < filters.seasonFrom || ep.season > filters.seasonTo) return false;
      if (filters.minQuality && (ep.quality ?? 0) < filters.minQuality) return false;
      if (filters.ageRating && ep.ageRating !== filters.ageRating) return false;
      if (!meetsMaxLevel(ep.violence, filters.violence)) return false;
      if (!meetsMaxLevel(ep.language, filters.language)) return false;
      if (!meetsMaxLevel(ep.sexualContent, filters.sexualContent)) return false;
      if (!meetsMaxLevel(ep.matureThemes, filters.matureThemes)) return false;
      if (!meetsMaxLevel(ep.sacrilege, filters.sacrilege)) return false;
      if (filters.favoritesOnly && !ep.favorite) return false;
      if (q && !ep.title.toLowerCase().includes(q) && !ep.summary.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filters]);

  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="header-title">
            <span className="header-donut">🍩</span>
            <div>
              <h1>Simpsons Episode Guide</h1>
              <p className="header-subtitle">Family-friendly ratings for all 36 seasons</p>
            </div>
          </div>
          <button
            className="filter-toggle-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle filters"
          >
            {sidebarOpen ? "✕ Close" : "⚙ Filters"}
          </button>
        </div>
      </header>

      <div className="layout">
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <Filters
            filters={filters}
            onChange={setFilters}
            totalCount={episodes.length}
            filteredCount={filtered.length}
            onReset={handleReset}
          />
        </div>

        <main className="main-content">
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>😞 No episodes match your filters.</p>
              <button className="reset-btn-large" onClick={handleReset}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="episode-grid">
              {filtered.map((ep) => (
                <EpisodeCard key={`${ep.season}-${ep.episode}`} ep={ep} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
