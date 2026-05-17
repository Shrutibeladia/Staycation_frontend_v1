import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { BookingContext } from "../../context/BookingContext";
import { useNavigate } from "react-router-dom";
import { bookings } from "../../api/apiService";
import { getErrorMessage } from "../../api/errorUtils";
import { format } from "date-fns";
import BookingDates from "../datePicker/BookingDates";
import { getBookingDateRange } from "../../utils/bookingDates";

const Reserve = ({ setOpen, hotelId, hotel, rooms = [] }) => {
  const [selected, setSelected] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { dates, options } = useContext(SearchContext);
  const { dispatch: bookingDispatch } = useContext(BookingContext);
  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start.getTime());
    const result = [];
    while (current < end) {
      result.push(format(current, "yyyy-MM-dd"));
      current.setDate(current.getDate() + 1);
    }
    return result;
  };

  const { checkInDate, checkOutDate, nights } = getBookingDateRange(dates);

  const isAvailable = (roomNumber) => {
    if (!dates?.[0]) return true;
    const rangeDates = getDatesInRange(dates[0].startDate, dates[0].endDate);
    return !roomNumber.unavailableDates?.some((d) =>
      rangeDates.includes(format(new Date(d), "yyyy-MM-dd"))
    );
  };

  const handleSelect = (room, roomNumber) => {
    setSelected({ room, roomNumber });
    setBookingError(null);
  };

  const handleBook = async () => {
    if (!selected) {
      setBookingError("Please select an available room number.");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setBookingError("Please select check-in and check-out dates from search.");
      return;
    }

    const totalPrice = selected.room.price * nights;
    const payload = {
      hotelId,
      roomId: selected.room._id,
      roomNumberId: selected.roomNumber._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests: options?.adult || 1,
    };

    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await bookings.create(payload);
      bookingDispatch({
        type: "SET_BOOKING_RESULT",
        payload: res.data.booking,
      });
      bookingDispatch({
        type: "SET_SELECTION",
        payload: { ...payload, lastBooking: res.data.booking },
      });
      setOpen(false);
      navigate("/success");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        setBookingError("Selected dates are no longer available. Please pick another room.");
      } else {
        setBookingError(getErrorMessage(err, "Booking failed. Please try again."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select a room at {hotel?.name}:</span>
        <BookingDates compact />
        {rooms.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">${item.price}/night</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers?.map((roomNumber) => {
                const available = isAvailable(roomNumber);
                const isSelected =
                  selected?.roomNumber?._id === roomNumber._id;
                return (
                  <div className="room" key={roomNumber._id}>
                    <label>
                      Room {roomNumber.number}
                      {!available && " (unavailable)"}
                    </label>
                    <input
                      type="radio"
                      name="roomNumber"
                      disabled={!available}
                      checked={isSelected}
                      onChange={() => handleSelect(item, roomNumber)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {bookingError && <div className="reserve-error">{bookingError}</div>}
        <button
          type="button"
          onClick={handleBook}
          className="rButton"
          disabled={submitting}
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
        {/* TODO: Payment step not integrated — backend Stripe flow is not production-ready */}
      </div>
    </div>
  );
};

export default Reserve;
