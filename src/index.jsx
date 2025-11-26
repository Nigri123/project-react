import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { CharacterList } from "./CharacterList";
import Search from "./components/Search";
import TopBar from "./TopBar";
import { BrowserRouter, Route, Routes } from "react-router";
import { Autors } from "./components/Autors";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/autors" element={<Autors />} />
        <Route path="*" element={<p className="text-[100px] text-center text-red-600 mt-[50px] ">Strony nie znaleziono 😟</p>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
