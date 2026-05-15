const AGE_RATINGS = ["All Ages", "10-15 years old", "PG-13", "Adults Only", "Not for Anyone"];
const CONTENT_LEVELS = ["Low", "Moderate", "High"];
const QUALITY_STARS = [5, 4, 3, 2];

function StarIcon({ filled }) {
  return (
    <span style={{ color: filled ? "#f5c518" : "#ccc", fontSize: "1.1rem" }}>★</span>
  );
}

function SectionLabel({ children }) {
  return <div className="filter-section-label">{children}</div>;
}

function ContentLevelFilter({ label, value, onChange }) {
  return (
    <div className="content-filter-row">
      <span className="content-filter-name">{label}</span>
      <div className="content-level-buttons">
        {CONTENT_LEVELS.map((level) => (
          <button
            key={level}
            className={`level-btn level-${level.toLowerCase()} ${value === level ? "active" : ""}`}
            onClick={() => onChange(value === level ? null : level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Filters({ filters, onChange, totalCount, filteredCount, onReset }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <aside className="filters-panel">
      <div className="filters-header">
        <h2>Filters</h2>
        <button className="reset-btn" onClick={onReset}>Reset all</button>
      </div>

      <div className="filter-results-count">
        Showing <strong>{filteredCount}</strong> of {totalCount} episodes
      </div>

      {/* Search */}
      <div className="filter-section">
        <SectionLabel>Search</SectionLabel>
        <input
          className="search-input"
          type="search"
          placeholder="Title or summary…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>

      {/* Season range */}
      <div className="filter-section">
        <SectionLabel>Season</SectionLabel>
        <div className="season-range">
          <select value={filters.seasonFrom} onChange={(e) => set("seasonFrom", Number(e.target.value))}>
            {Array.from({ length: 36 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>Season {s}</option>
            ))}
          </select>
          <span>to</span>
          <select value={filters.seasonTo} onChange={(e) => set("seasonTo", Number(e.target.value))}>
            {Array.from({ length: 36 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s}>Season {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quality */}
      <div className="filter-section">
        <SectionLabel>Min Quality</SectionLabel>
        <div className="quality-buttons">
          {QUALITY_STARS.map((q) => (
            <button
              key={q}
              className={`quality-btn ${filters.minQuality === q ? "active" : ""}`}
              onClick={() => set("minQuality", filters.minQuality === q ? null : q)}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} filled={i < q} />
              ))}
              {q < 5 && <span className="quality-label">& up</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Age Rating */}
      <div className="filter-section">
        <SectionLabel>Age Rating</SectionLabel>
        <div className="age-rating-buttons">
          {AGE_RATINGS.map((r) => (
            <button
              key={r}
              className={`age-btn ${filters.ageRating === r ? "active" : ""}`}
              onClick={() => set("ageRating", filters.ageRating === r ? null : r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Content filters */}
      <div className="filter-section">
        <SectionLabel>Max Content Level</SectionLabel>
        <p className="filter-hint">Tap a level to show episodes <em>at or below</em> that level</p>
        <ContentLevelFilter label="Violence" value={filters.violence} onChange={(v) => set("violence", v)} />
        <ContentLevelFilter label="Language" value={filters.language} onChange={(v) => set("language", v)} />
        <ContentLevelFilter label="Sexual Content" value={filters.sexualContent} onChange={(v) => set("sexualContent", v)} />
        <ContentLevelFilter label="Mature Themes" value={filters.matureThemes} onChange={(v) => set("matureThemes", v)} />
        <ContentLevelFilter label="Sacrilege" value={filters.sacrilege} onChange={(v) => set("sacrilege", v)} />
      </div>

      {/* Favorites only */}
      <div className="filter-section">
        <label className="favorites-toggle">
          <input
            type="checkbox"
            checked={filters.favoritesOnly}
            onChange={(e) => set("favoritesOnly", e.target.checked)}
          />
          <span>Favorites only</span>
        </label>
      </div>
    </aside>
  );
}
