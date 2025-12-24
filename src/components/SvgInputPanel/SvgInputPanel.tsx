import { useState, DragEvent } from "react";
import "./SvgInputPanel.css";

interface SvgInputPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export function SvgInputPanel({ value, onChange }: SvgInputPanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    // File handling will be implemented later
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onChange(content);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleFileSelect = () => {
    // File dialog will be implemented with Tauri later
    console.log("Open file dialog");
  };

  return (
    <div className="svg-input-panel">
      <div className="svg-input-panel__header">
        <h2 className="svg-input-panel__title">SVG Input</h2>
        <button
          className="svg-input-panel__file-btn"
          onClick={handleFileSelect}
        >
          Open File
        </button>
      </div>

      <div
        className={`svg-input-panel__dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!value ? (
          <div className="svg-input-panel__placeholder">
            <div className="svg-input-panel__icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="svg-input-panel__hint">
              Drop SVG file here or paste SVG code below
            </p>
          </div>
        ) : (
          <div className="svg-input-panel__preview">
            <div
              className="svg-input-panel__svg-render"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        )}
      </div>

      <textarea
        className="svg-input-panel__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your SVG code here..."
        spellCheck={false}
      />
    </div>
  );
}
