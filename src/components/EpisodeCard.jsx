const LEVEL_ORDER = { Low: 1, Moderate: 2, High: 3 };

const AGE_COLORS = {
  "All Ages": { bg: "#d4edda", text: "#155724" },
  "10-15 years old": { bg: "#fff3cd", text: "#856404" },
  "PG-13": { bg: "#ffe5b4", text: "#7d4e00" },
  "Adults Only": { bg: "#f8d7da", text: "#721c24" },
  "Not for Anyone": { bg: "#e2d9f3", text: "#4a235a" },
};

const LEVEL_COLORS = {
  Low: { bg: "#d4edda", text: "#155724" },
  Moderate: { bg: "#fff3cd", text: "#856404" },
  High: { bg: "#f8d7da", text: "#721c24" },
};

function Badge({ label, style }) {
  return (
    <span
      className="badge"
      style={{ background: style?.bg, color: style?.text }}
    >
      {label}
    </span>
  );
}

function Stars({ count }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < count ? "#f5c518" : "#ddd" }}>★</span>
      ))}
    </span>
  );
}

function ContentBadges({ ep }) {
  const fields = [
    { key: "violence", label: "Violence" },
    { key: "language", label: "Language" },
    { key: "sexualContent", label: "Sexual" },
    { key: "matureThemes", label: "Themes" },
    { key: "sacrilege", label: "Sacrilege" },
  ];

  const notable = fields.filter(
    (f) => ep[f.key] && LEVEL_ORDER[ep[f.key]] >= 2
  );

  if (notable.length === 0) {
    return <span className="all-clear">✓ Family friendly</span>;
  }

  return (
    <div className="content-badges">
      {notable.map((f) => (
        <Badge
          key={f.key}
          label={`${f.label}: ${ep[f.key]}`}
          style={LEVEL_COLORS[ep[f.key]]}
        />
      ))}
    </div>
  );
}

export default function EpisodeCard({ ep }) {
  const ageStyle = AGE_COLORS[ep.ageRating] ?? { bg: "#e9ecef", text: "#495057" };

  return (
    <article className="episode-card">
      <div className="card-header">
        <div className="card-meta">
          <span className="card-season-ep">
            S{String(ep.season).padStart(2, "0")} · E{String(ep.episode).padStart(2, "0")}
          </span>
          {ep.quality && <Stars count={ep.quality} />}
        </div>
        {ep.ageRating && (
          <Badge label={ep.ageRating} style={ageStyle} />
        )}
      </div>

      <h3 className="card-title">{ep.title}</h3>

      {ep.summary && (
        <p className="card-summary">{ep.summary}</p>
      )}

      <div className="card-footer">
        <ContentBadges ep={ep} />
        {ep.reviewNotes && (
          <p className="card-review-note">
            <span className="review-note-icon">💬</span> {ep.reviewNotes}
          </p>
        )}
        {ep.otherConcerns && (
          <p className="card-concerns">
            <span>⚠️</span> {ep.otherConcerns}
          </p>
        )}
      </div>
    </article>
  );
}
