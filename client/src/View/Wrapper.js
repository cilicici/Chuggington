import React from "react";
import { Link } from "react-router-dom";
import { handleLogout } from '../lib/auth'
import "./page.css";


function Wrapper({ children }) {
  return (
    <div className="Stations">
      <h1>Chuggington</h1>
      <h3 className="username">user: {localStorage.getItem("name")}</h3>
      <div>
      <button>
        <Link to="/">Stations</Link>
      </button>
      <button>
        <Link to="/connectRoute">ConnectRoute</Link>
      </button>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      </div>
      {children}
    </div>
  );
}

export default Wrapper;
