import React from "react";
import { UI_LIBRARY_VERSION } from "@nudum/ui";

function App() {
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>نُظُم | Nudum Enterprise Platform</h1>
      <p>UI Library version: {UI_LIBRARY_VERSION}</p>
    </div>
  );
}

export default App;
