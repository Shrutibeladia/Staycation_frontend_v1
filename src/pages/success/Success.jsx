import { Link } from "react-router-dom";
import "./success.css";

const Success = () => {
  return (
    <div className="successPage">
      <div className="successContainer">
        <h1>Booking Successful!</h1>
        <p>Your room has been reserved successfully.</p>
        <div className="successDetails">
          <p>Thank you for choosing StayCation. We&apos;re preparing your stay and will send a confirmation soon.</p>
        </div>
        <Link to="/" className="successButton">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
