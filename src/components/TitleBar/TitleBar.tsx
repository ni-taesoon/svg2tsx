import { getCurrentWindow } from "@tauri-apps/api/window";
import "./TitleBar.css";

interface TitleBarProps {
  theme: "system" | "light" | "dark";
  onThemeChange: (theme: "system" | "light" | "dark") => void;
}

export function TitleBar({ theme, onThemeChange }: TitleBarProps) {
  const handleDragStart = () => {
    getCurrentWindow().startDragging();
  };

  const handleDoubleClick = () => {
    getCurrentWindow().toggleMaximize();
  };

  return (
    <header className="title-bar">
      <div
        className="title-bar__drag-region"
        onMouseDown={handleDragStart}
        onDoubleClick={handleDoubleClick}
      />
      <div className="title-bar__content">
        <h1 className="title-bar__title">SVG2TSX</h1>
        <div className="title-bar__theme-selector">
          <button
            className={theme === "system" ? "active" : ""}
            onClick={() => onThemeChange("system")}
            title="System theme"
          >
            Auto
          </button>
          <button
            className={theme === "light" ? "active" : ""}
            onClick={() => onThemeChange("light")}
            title="Light theme"
          >
            Light
          </button>
          <button
            className={theme === "dark" ? "active" : ""}
            onClick={() => onThemeChange("dark")}
            title="Dark theme"
          >
            Dark
          </button>
        </div>
      </div>
    </header>
  );
}
