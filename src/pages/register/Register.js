import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
//import "./login.css";

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: undefined,
    email: undefined,
    username: undefined,
    phone: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    // dispatch({ type: "LOGIN_START" });
    // try {
    //   const res = await axios.post("/auth/login", credentials);
    //   dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
    //   navigate("/")
    // } catch (err) {
    //   dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    // }
  };


  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="name"
          id="name"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="text"
          placeholder="Phone Number"
          id="phone"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="text"
          placeholder="city"
          id="city"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Register
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Register;





