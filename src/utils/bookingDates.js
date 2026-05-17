import { addDays, format } from "date-fns";

/**
 * Normalize check-in / check-out for API (checkout must be after check-in).
 */
export const getBookingDateRange = (dates) => {
  if (!dates?.[0]?.startDate) {
    return { checkInDate: null, checkOutDate: null, nights: 1 };
  }

  const start = new Date(dates[0].startDate);
  let end = dates[0].endDate ? new Date(dates[0].endDate) : addDays(start, 1);

  if (end <= start) {
    end = addDays(start, 1);
  }

  const nights = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    checkInDate: format(start, "yyyy-MM-dd"),
    checkOutDate: format(end, "yyyy-MM-dd"),
    nights,
  };
};
