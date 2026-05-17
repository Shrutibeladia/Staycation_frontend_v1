import { useContext } from "react";
import { Link } from "react-router-dom";
import { BookingContext } from "../../context/BookingContext";
import "./success.css";

const Success = () => {
  const { lastBooking } = useContext(BookingContext);

  return (
    <div className="successPage">
      <div className="successContainer">
        <h1>Booking Successful!</h1>
        <p>Your room has been reserved successfully.</p>
        <div className="successDetails">
          {lastBooking ? (
            <>
              <p>Booking ID: {lastBooking._id}</p>
              <p>
                {lastBooking.checkInDate} → {lastBooking.checkOutDate}
              </p>
              <p>Total: ${lastBooking.totalPrice}</p>
            </>
          ) : (
            <p>
              Thank you for choosing StayCation. View your bookings anytime from
              your account.
            </p>
          )}
        </div>
        <Link to="/bookings" className="successButton">
          View My Bookings
        </Link>
        <Link to="/" className="successButton successButtonSecondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
