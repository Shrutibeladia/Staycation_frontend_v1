import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  hotelId: null,
  roomId: null,
  roomNumberId: null,
  checkInDate: null,
  checkOutDate: null,
  totalPrice: 0,
  guests: 1,
  lastBooking: null,
};

export const BookingContext = createContext(INITIAL_STATE);

const BookingReducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTION":
      return { ...state, ...action.payload };
    case "SET_BOOKING_RESULT":
      return { ...state, lastBooking: action.payload };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const BookingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BookingReducer, INITIAL_STATE);

  return (
    <BookingContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
