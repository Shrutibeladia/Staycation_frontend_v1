import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import ErrorBanner from "../../components/errorBanner/ErrorBanner";
import PaginationControls from "../../components/pagination/PaginationControls";
import { getErrorMessage } from "../../api/errorUtils";

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [dates, setDates] = useState(
    location.state?.dates || [
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]
  );
  const [openDate, setOpenDate] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (destination) params.set("city", destination);
    if (type) params.set("type", type);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    return `/hotels?${params.toString()}`;
  }, [destination, type, min, max, page]);

  const { data, meta, loading, error, reFetch } = useFetch(queryString);

  const handleSearch = () => {
    setPage(1);
  };

  const errorMessage = error ? getErrorMessage(error, "Failed to load hotels.") : null;

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination (exact city name)</label>
              <input
                placeholder="e.g. Jaipur"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All types</option>
                <option value="hotel">Hotel</option>
                <option value="apartments">Apartments</option>
                <option value="resorts">Resorts</option>
                <option value="villas">Villas</option>
                <option value="cabins">Cabins</option>
              </select>
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
              </div>
            </div>
            <button type="button" onClick={handleSearch}>
              Search
            </button>
          </div>
          <div className="listResult">
            {loading ? (
              <LoadingSkeleton count={4} type="list" />
            ) : errorMessage ? (
              <ErrorBanner message={errorMessage} onRetry={reFetch} />
            ) : (
              <>
                {data?.length === 0 && (
                  <p className="no-results">No hotels found. Try another city or filters.</p>
                )}
                {data?.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
                <PaginationControls
                  page={meta?.page || page}
                  total={meta?.total || 0}
                  limit={meta?.limit || limit}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
