import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { CharacterList } from "./CharacterList";
import Search from "./components/Search";
import TopBar from "./TopBar";
import { Autors } from "./components/Autors";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TopBar />
    <Autors />
  </React.StrictMode>
);
