import { useState, useEffect } from "react";
import { useTheme } from "./useTheme";
import {
  TitleBar,
  SvgInputPanel,
  TsxOutputPanel,
  OptionsPanel,
  ConversionOptions,
} from "./components";
import "./App.css";

const defaultOptions: ConversionOptions = {
  removeUnnecessaryAttrs: true,
  removeComments: true,
  removeEmptyGroups: true,
  convertToCurrentColor: false,
  componentName: "Icon",
  exportType: "default",
  useMemo: false,
  useForwardRef: false,
  addSizeProps: true,
};

function App() {
  const { theme, setTheme } = useTheme();
  const [svgInput, setSvgInput] = useState("");
  const [tsxOutput, setTsxOutput] = useState("");
  const [options, setOptions] = useState<ConversionOptions>(defaultOptions);

  // Simple SVG to TSX conversion (placeholder - will be enhanced later)
  useEffect(() => {
    if (!svgInput.trim()) {
      setTsxOutput("");
      return;
    }

    // Basic conversion logic (to be replaced with proper implementation)
    const converted = generateTsxCode(svgInput, options);
    setTsxOutput(converted);
  }, [svgInput, options]);

  return (
    <div className="app">
      <TitleBar theme={theme} onThemeChange={setTheme} />

      <main className="app__main">
        <div className="app__panels">
          <div className="app__panel app__panel--left">
            <SvgInputPanel value={svgInput} onChange={setSvgInput} />
          </div>
          <div className="app__panel app__panel--right">
            <TsxOutputPanel
              code={tsxOutput}
              componentName={options.componentName}
            />
          </div>
        </div>

        <div className="app__options">
          <OptionsPanel options={options} onChange={setOptions} />
        </div>
      </main>
    </div>
  );
}

// Simple TSX code generator (placeholder implementation)
function generateTsxCode(svg: string, options: ConversionOptions): string {
  const { componentName, exportType, useMemo, useForwardRef, addSizeProps } =
    options;

  // Convert SVG attributes to React JSX format
  let processedSvg = svg
    .replace(/class=/g, "className=")
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/clip-rule=/g, "clipRule=")
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=")
    .replace(/stroke-miterlimit=/g, "strokeMiterlimit=")
    .replace(/font-size=/g, "fontSize=")
    .replace(/font-family=/g, "fontFamily=")
    .replace(/text-anchor=/g, "textAnchor=")
    .replace(/xlink:href=/g, "href=")
    .replace(/xmlns:xlink="[^"]*"/g, "")
    .replace(/xmlns="[^"]*"/g, "");

  // Remove extra whitespace
  processedSvg = processedSvg.trim();

  // Build imports
  const imports: string[] = [];
  if (addSizeProps) {
    imports.push("SVGProps");
  }
  if (useMemo) {
    imports.push("memo");
  }
  if (useForwardRef) {
    imports.push("forwardRef");
  }

  const importStatement =
    imports.length > 0
      ? `import { ${imports.join(", ")} } from 'react';\n\n`
      : "";

  // Build interface
  const interfaceStr = addSizeProps
    ? `interface ${componentName}Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

`
    : "";

  // Build component
  let component: string;
  const propsType = addSizeProps ? `${componentName}Props` : "{}";
  const propsDestructure = addSizeProps
    ? "{ size = 24, ...props }"
    : "props";

  if (useForwardRef) {
    component = `const ${componentName} = forwardRef<SVGSVGElement, ${propsType}>(
  (${propsDestructure}, ref) => (
    ${processedSvg.replace("<svg", "<svg ref={ref}")}
  )
);

${componentName}.displayName = '${componentName}';`;
  } else {
    component = `const ${componentName} = (${propsDestructure}: ${propsType}) => (
  ${processedSvg}
);`;
  }

  // Wrap with memo if needed
  if (useMemo) {
    component += `\n\nconst Memoized${componentName} = memo(${componentName});`;
  }

  // Build export
  const exportName = useMemo ? `Memoized${componentName}` : componentName;
  const exportStatement =
    exportType === "default"
      ? `\nexport default ${exportName};`
      : `\nexport { ${exportName}${useMemo ? ` as ${componentName}` : ""} };`;

  return `${importStatement}${interfaceStr}${component}${exportStatement}
`;
}

export default App;
