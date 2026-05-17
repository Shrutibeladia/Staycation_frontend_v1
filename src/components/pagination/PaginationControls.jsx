import "./pagination.css";

const PaginationControls = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 10)));

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
