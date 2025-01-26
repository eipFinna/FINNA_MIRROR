import React from "react";
import Header from "./components/Header";
import Features from "./components/Features";
import DownloadSection from "./components/DownloadSection";
import Footer from "./components/Footer";

import UserFeedback from "./components/UserFeedback";

import Documentation from "./components/Documentation";

import "./App.css";

function App() {
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

export default App;
