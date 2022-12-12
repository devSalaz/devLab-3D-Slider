import React, { useState } from "react";
import CanvasComponent from "./components/CanvasComponent";
import Slider from "./components/Slider";
import ArtistPalette from "./assets/emojis/artist-palette.png";
import "./App.css";

function App() {
  const [isLoaded, setLoaded] = useState(false);
  const [offset] = useState({
    x: 2,
    noiseX: 0,
    noiseDirection: 1,
    isMoving: 0,
  });

  return (
    <div className="App">
      <Slider offset={offset} />
      <CanvasComponent
        offset={offset}
        isLoaded={isLoaded}
        setLoaded={setLoaded}
      />
      <div className={`loader-container ${isLoaded ? "loaded" : ""}`}>
        <h2>Gallery Image</h2>
        <img src={ArtistPalette} alt="artist-palette" />
      </div>
    </div>
  );
}

export default App;
