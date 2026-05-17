import "./notification.css";

const Notification = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`toast toast-${type || "info"}`}>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;
