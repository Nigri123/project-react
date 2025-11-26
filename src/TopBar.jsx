import React from "react";
import logo from "/public/NarutoLogo.png";
import { Link } from "react-router";

export function TopBar({ height = 64 }) {
  return (
    <div className="bg-gray-800 p-4">
      <Link to="/Autors" className="absolute text-[100px] right-5 top-0">👷🏾</Link>
      <Link to="/">
        <img
          className="h-30 text-align-center mx-auto my-4"
          to="/"
          src={logo}
          alt="Naruto Logo"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </Link>

    </div>
  );
}

export default TopBar;
