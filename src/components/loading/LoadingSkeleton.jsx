import "./loadingSkeleton.css";

const LoadingSkeleton = ({ count = 3, type = "card" }) => {
  if (type === "list") {
    return (
      <div className="skeleton-list">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-list-item" />
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
