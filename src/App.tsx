import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTheme } from "./useTheme";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const { theme, setTheme } = useTheme();

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  const handleDragStart = () => {
    getCurrentWindow().startDragging();
  };

  const handleDoubleClick = () => {
    getCurrentWindow().toggleMaximize();
  };

  return (
    <>
      <div
        className="drag-region"
        onMouseDown={handleDragStart}
        onDoubleClick={handleDoubleClick}
      />
      <div className="theme-selector">
        <button
          className={theme === "system" ? "active" : ""}
          onClick={() => setTheme("system")}
        >
          System
        </button>
        <button
          className={theme === "light" ? "active" : ""}
          onClick={() => setTheme("light")}
        >
          Light
        </button>
        <button
          className={theme === "dark" ? "active" : ""}
          onClick={() => setTheme("dark")}
        >
          Dark
        </button>
      </div>
      <main className="container">
        <h1>Welcome to Tauri + React</h1>

        <div className="row">
          <a href="https://vite.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://tauri.app" target="_blank">
            <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <p>Click on the Tauri, Vite, and React logos to learn more.</p>

        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>
        <p>{greetMsg}</p>
      </main>
    </>
  );
}

export default App;
