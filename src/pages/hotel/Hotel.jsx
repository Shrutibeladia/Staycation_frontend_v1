import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import useAuth from "../../hooks/useAuth";
import Reserve from "../../components/reserve/Reserve";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import ErrorBanner from "../../components/errorBanner/ErrorBanner";
import { getErrorMessage } from "../../api/errorUtils";
import BookingDates from "../../components/datePicker/BookingDates";
import { getBookingDateRange } from "../../utils/bookingDates";

const Hotel = () => {
  const { id } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { data, loading, error, reFetch } = useFetch(`/hotels/find/${id}`, {
    mode: "object",
  });
  const { data: rooms, loading: roomsLoading } = useFetch(`/hotels/room/${id}`);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { dates } = useContext(SearchContext);

  const { nights } = getBookingDateRange(dates);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    const photoCount = data?.photos?.length || 1;
    if (direction === "l") {
      setSlideNumber(slideNumber === 0 ? photoCount - 1 : slideNumber - 1);
    } else {
      setSlideNumber(slideNumber === photoCount - 1 ? 0 : slideNumber + 1);
    }
  };

  const handleBook = () => {
    if (isAuthenticated) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  const errorMessage = error
    ? getErrorMessage(error, "Hotel not found.")
    : !loading && !data
      ? "Hotel not found. It may have been removed or the link is invalid."
      : null;

  const showContent = Boolean(!loading && data && !error);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        <div className="hotelContainer">
          <LoadingSkeleton count={1} type="list" />
        </div>
      ) : !showContent ? (
        <div className="hotelContainer">
          <ErrorBanner message={errorMessage || "Hotel not found."} onRetry={reFetch} />
        </div>
      ) : (
        <div className="hotelContainer">
          {open && data?.photos && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <button type="button" className="bookNow" onClick={handleBook}>
              Reserve or Book Now!
            </button>
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>
            <span className="hotelDistance">
              Excellent location – {data.distance}m from center
            </span>
            <span className="hotelPriceHighlight">
              Book a stay over ${data.cheapestPrice} at this property
            </span>
            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.desc}</p>
              </div>
              <div className="hotelDetailsPrice">
                <h1>Perfect for a {nights}-night stay!</h1>
                <BookingDates compact />
                <h2>
                  <b>${nights * data.cheapestPrice}</b> ({nights} nights)
                </h2>
                <button type="button" onClick={handleBook}>
                  Reserve or Book Now!
                </button>
              </div>
            </div>

            <section className="hotelRoomsSection">
              <h2>Available rooms</h2>
              {roomsLoading ? (
                <p>Loading rooms...</p>
              ) : rooms?.length > 0 ? (
                <div className="hotelRoomsList">
                  {rooms.map((room) => (
                    <div key={room._id} className="hotelRoomCard">
                      <h3>{room.title}</h3>
                      <p>{room.desc}</p>
                      <p>
                        ${room.price}/night · Max {room.maxPeople} guests
                      </p>
                      <p className="roomNumbers">
                        Room numbers:{" "}
                        {room.roomNumbers?.map((rn) => rn.number).join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No rooms listed for this hotel yet.</p>
              )}
            </section>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && data && (
        <Reserve setOpen={setOpenModal} hotelId={id} hotel={data} rooms={rooms} />
      )}
    </div>
  );
};

export default Hotel;
