import React from "react";
import logo from "/public/NarutoLogo.png";

export function TopBar({ height = 64 }) {
  return (
    <div class="bg-gray-800 p-4">
      <img
        class="h-30 text-align-center mx-auto my-4"
        src={logo}
        alt="Naruto Logo"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
    </div>
  );
}

export default TopBar;
