import { useCallback, useState } from "react";
import { bookings } from "../api/apiService";
import { getErrorMessage } from "../api/errorUtils";

/**
 * Fetch and manage user bookings.
 */
const useBookings = (userId) => {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await bookings.getByUser(userId);
      setBookingsList(res.data.bookings || []);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load bookings."));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const cancelBooking = async (bookingId) => {
    try {
      await bookings.cancel(bookingId);
      await fetchBookings();
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err, "Unable to cancel booking.") };
    }
  };

  return { bookingsList, loading, error, fetchBookings, cancelBooking };
};

export default useBookings;
