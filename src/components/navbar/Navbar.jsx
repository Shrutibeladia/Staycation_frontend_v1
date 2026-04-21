import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate=useNavigate();
  const navigateLogin=()=>{
    navigate('/login');
  }
  const navigateRegister=()=>{
    navigate('/register');
  }
 

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">StayCation</span>
        </Link>
        {user ? user.username : (
          <div className="navItems">
            <button className="navButton" href="/register" onClick={navigateRegister}>Register</button>
            <button className="navButton" onClick={navigateLogin}>Login</button>
            {/* <div class="dropdown-content">
                            <a href="#">Stays</a>
                            <a href="#">Flights</a>
                            <a href="#">Car Rentals</a>
                            <a href="#">Attractions</a>
                            <a href="#">Airport taxis</a>
                        </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;