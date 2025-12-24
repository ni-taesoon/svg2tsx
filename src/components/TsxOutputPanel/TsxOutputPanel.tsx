import { useState } from "react";
import "./TsxOutputPanel.css";

interface TsxOutputPanelProps {
  code: string;
  componentName: string;
}

export function TsxOutputPanel({ code, componentName }: TsxOutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSave = () => {
    // File save will be implemented with Tauri later
    console.log("Save file:", componentName);
  };

  return (
    <div className="tsx-output-panel">
      <div className="tsx-output-panel__header">
        <h2 className="tsx-output-panel__title">TSX Output</h2>
        <div className="tsx-output-panel__filename">
          {componentName ? `${componentName}.tsx` : "Component.tsx"}
        </div>
        <div className="tsx-output-panel__actions">
          <button
            className="tsx-output-panel__btn"
            onClick={handleCopy}
            disabled={!code}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            className="tsx-output-panel__btn tsx-output-panel__btn--primary"
            onClick={handleSave}
            disabled={!code}
          >
            Save
          </button>
        </div>
      </div>

      <div className="tsx-output-panel__code-container">
        {code ? (
          <pre className="tsx-output-panel__code">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="tsx-output-panel__placeholder">
            <div className="tsx-output-panel__icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polyline points="16,18 22,12 16,6" />
                <polyline points="8,6 2,12 8,18" />
              </svg>
            </div>
            <p className="tsx-output-panel__hint">
              TSX code will appear here after conversion
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
