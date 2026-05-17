import { useContext, useState } from "react";
import { DateRange } from "react-date-range";
import { format, addDays } from "date-fns";
import { SearchContext } from "../../context/SearchContext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./bookingDates.css";

/**
 * Shared check-in / check-out picker — updates SearchContext for booking.
 */
const BookingDates = ({ compact = false }) => {
  const { dates, options, dispatch } = useContext(SearchContext);
  const [open, setOpen] = useState(false);

  const selection = dates?.[0] || {
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  };

  const handleChange = (item) => {
    const { startDate, endDate } = item.selection;
    // Ensure at least 1 night: checkout must be after check-in
    const safeEnd =
      !endDate || endDate <= startDate ? addDays(startDate, 1) : endDate;

    dispatch({
      type: "NEW_SEARCH",
      payload: {
        dates: [{ startDate, endDate: safeEnd, key: "selection" }],
        options,
      },
    });
  };

  return (
    <div className={`booking-dates ${compact ? "booking-dates-compact" : ""}`}>
      <label className="booking-dates-label">Check-in — Check-out</label>
      <button
        type="button"
        className="booking-dates-trigger"
        onClick={() => setOpen(!open)}
      >
        {format(selection.startDate, "MMM d, yyyy")} →{" "}
        {format(selection.endDate, "MMM d, yyyy")}
      </button>
      {open && (
        <div className="booking-dates-calendar">
          <DateRange
            editableDateInputs
            onChange={handleChange}
            moveRangeOnFirstSelection={false}
            ranges={[selection]}
            minDate={new Date()}
          />
        </div>
      )}
    </div>
  );
};

export default BookingDates;
