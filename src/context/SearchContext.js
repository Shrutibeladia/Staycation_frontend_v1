import { createContext, useReducer } from "react";
import { addDays } from "date-fns";

const today = new Date();

const INITIAL_STATE = {
  city: undefined,
  type: undefined,
  min: undefined,
  max: undefined,
  page: 1,
  limit: 10,
  dates: [
    {
      startDate: today,
      endDate: addDays(today, 1),
      key: "selection",
    },
  ],
  options: {
    adult: 1,
    children: 0,
    room: 1,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return { ...state, ...action.payload };
    case "SET_FILTERS":
      return { ...state, ...action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        type: state.type,
        min: state.min,
        max: state.max,
        page: state.page,
        limit: state.limit,
        dates: state.dates,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
