import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Notification from "../../components/notification/Notification";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import ErrorBanner from "../../components/errorBanner/ErrorBanner";
import useBookings from "../../hooks/useBookings";
import { AuthContext } from "../../context/AuthContext";
import "./bookings.css";

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const { bookingsList, loading, error, fetchBookings, cancelBooking } =
    useBookings(user?._id);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm("Cancel this booking?");
    if (!confirmed) return;
    const result = await cancelBooking(bookingId);
    if (result.success) {
      setToast({ type: "success", message: "Booking cancelled." });
    } else {
      setToast({ type: "error", message: result.message });
    }
  };

  return (
    <div className="bookings-page">
      <Navbar />
      <div className="bookings-container">
        <h1>My Bookings</h1>
        <p>View and manage your reservations.</p>

        {loading ? (
          <LoadingSkeleton count={3} type="list" />
        ) : error ? (
          <ErrorBanner message={error} onRetry={fetchBookings} />
        ) : bookingsList.length === 0 ? (
          <p className="bookings-empty">You have no bookings yet.</p>
        ) : (
          <div className="bookings-list">
            {bookingsList.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-info">
                  <h3>Booking #{booking._id?.slice(-6)}</h3>
                  <p>
                    {booking.checkInDate} → {booking.checkOutDate}
                  </p>
                  <p>Guests: {booking.guests || 1}</p>
                  <p>Total: ${booking.totalPrice}</p>
                  <p className="booking-status">Status: {booking.status || "pending"}</p>
                </div>
                {booking.status !== "cancelled" && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <Notification
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Bookings;
