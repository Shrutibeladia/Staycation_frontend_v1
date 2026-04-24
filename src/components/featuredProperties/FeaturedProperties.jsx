import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true");

  return (
    <div className="fp">
      {loading ? (
        <div className="loading-state">Loading amazing properties...</div>
      ) : (
        <>
          {data && data.map((item) => (
            <div className="fpItem card" key={item._id}>
              <div className="fp-image-wrapper">
                <img
                  src={item.photos[0]}
                  alt={item.name}
                  className="fpImg"
                />
                {item.rating && (
                  <div className="fpRating">
                    <button className="rating-badge">
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
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;