import "./errorBanner.css";

const ErrorBanner = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-banner">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="error-banner-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
