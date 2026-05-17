import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import LoadingSkeleton from "../loading/LoadingSkeleton";
import ErrorBanner from "../errorBanner/ErrorBanner";
import { getErrorMessage } from "../../api/errorUtils";

const FeaturedProperties = () => {
  const { data, loading, error, reFetch } = useFetch(
    "/hotels?featured=true&limit=8"
  );

  const errorMessage = error
    ? getErrorMessage(error, "Could not load featured hotels.")
    : null;

  return (
    <div className="fp">
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : errorMessage ? (
        <ErrorBanner message={errorMessage} onRetry={reFetch} />
      ) : (
        <>
          {data?.map((item) => (
            <Link
              to={`/hotels/${item._id}`}
              className="fpItem card"
              key={item._id}
            >
              <div className="fp-image-wrapper">
                <img
                  src={item.photos?.[0]}
                  alt={item.name}
                  className="fpImg"
                />
                {item.rating && (
                  <div className="fpRating">
                    <button type="button" className="rating-badge">
                      <FontAwesomeIcon icon={faStar} />
                      {item.rating}
                    </button>
                    <span>Excellent</span>
                  </div>
                )}
              </div>
              <div className="fp-content">
                <h3 className="fpName">{item.name}</h3>
                <p className="fpCity">{item.city}</p>
                <p className="fpPrice">
                  From <strong>${item.cheapestPrice}</strong> per night
                </p>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
