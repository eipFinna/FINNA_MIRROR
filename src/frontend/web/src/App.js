import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Features from "./components/Features";
import DownloadSection from "./components/DownloadSection";
import Footer from "./components/Footer";
import FinnaPage from "./pages/Finna";
import UserFeedback from "./components/UserFeedback";
import Documentation from "./components/Documentation";
import "./App.css";
import LoginRegister from "./pages/LoginRegister";

function Home() {
  return (
    <div className="App">
      <Header />
      <Features />
      <Documentation />
      <DownloadSection />
      <UserFeedback />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/finna" element={<FinnaPage />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;