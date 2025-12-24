import "./OptionsPanel.css";

export interface ConversionOptions {
  // SVG Optimization
  removeUnnecessaryAttrs: boolean;
  removeComments: boolean;
  removeEmptyGroups: boolean;
  convertToCurrentColor: boolean;

  // TSX Options
  componentName: string;
  exportType: "default" | "named";
  useMemo: boolean;
  useForwardRef: boolean;
  addSizeProps: boolean;
}

interface OptionsPanelProps {
  options: ConversionOptions;
  onChange: (options: ConversionOptions) => void;
}

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  const updateOption = <K extends keyof ConversionOptions>(
    key: K,
    value: ConversionOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="options-panel">
      <div className="options-panel__section">
        <h3 className="options-panel__section-title">Component</h3>
        <div className="options-panel__row">
          <label className="options-panel__label">Name</label>
          <input
            type="text"
            className="options-panel__input"
            value={options.componentName}
            onChange={(e) => updateOption("componentName", e.target.value)}
            placeholder="IconName"
          />
        </div>
        <div className="options-panel__row">
          <label className="options-panel__label">Export</label>
          <select
            className="options-panel__select"
            value={options.exportType}
            onChange={(e) =>
              updateOption("exportType", e.target.value as "default" | "named")
            }
          >
            <option value="default">Default</option>
            <option value="named">Named</option>
          </select>
        </div>
      </div>

      <div className="options-panel__section">
        <h3 className="options-panel__section-title">SVG Optimization</h3>
        <label className="options-panel__checkbox">
          <input
            type="checkbox"
            checked={options.removeUnnecessaryAttrs}
            onChange={(e) =>
              updateOption("removeUnnecessaryAttrs", e.target.checked)
            }
          />
          <span>Remove unnecessary attributes</span>
        </label>
        <label className="options-panel__checkbox">
          <input
            type="checkbox"
            checked={options.removeComments}
            onChange={(e) => updateOption("removeComments", e.target.checked)}
          />
          <span>Remove comments</span>
        </label>
        <label className="options-panel__checkbox">
          <input
            type="checkbox"
            checked={options.removeEmptyGroups}
            onChange={(e) =>
              updateOption("removeEmptyGroups", e.target.checked)
            }
          />
          <span>Remove empty groups</span>
        </label>
        <label className="options-panel__checkbox">
          <input
            type="checkbox"
            checked={options.convertToCurrentColor}
            onChange={(e) =>
              updateOption("convertToCurrentColor", e.target.checked)
            }
          />
          <span>Convert to currentColor</span>
        </label>
      </div>

      <div className="options-panel__section">
        <h3 className="options-panel__section-title">TSX Options</h3>
        <label className="options-panel__checkbox">
          <input
            type="checkbox"
            checked={options.addSizeProps}
            onChange={(e) => updateOption("addSizeProps", e.target.checked)}
          />
          <span>Add size prop</span>
        </label>
        <label className="options-panel__checkbox">
          <input
            type="checkbox"
            checked={options.useMemo}
            onChange={(e) => updateOption("useMemo", e.target.checked)}
          />
          <span>Wrap with React.memo</span>
        </label>
        <label className="options-panel__checkbox">
          <input
            type="checkbox"
            checked={options.useForwardRef}
            onChange={(e) => updateOption("useForwardRef", e.target.checked)}
          />
          <span>Use forwardRef</span>
        </label>
      </div>
    </div>
  );
}
