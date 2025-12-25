# Task 03: 기본 UI 및 레이아웃

**담당 영역**: UI 컴포넌트, 레이아웃, Tab 기반 인터페이스
**우선순위**: P0 (핵심)
**예상 기간**: 3일
**선행 작업**: Task 01 (프로젝트 설정)

---

## 1. pages/main 구현

### 1.1 MainPage.tsx
- [ ] `src/pages/main/ui/MainPage.tsx` 생성
- [ ] 전체 레이아웃 컨테이너 구현
- [ ] 반응형 레이아웃 적용

```typescript
// src/pages/main/ui/MainPage.tsx
interface MainPageProps {
  className?: string;
}

export const MainPage: React.FC<MainPageProps> = ({ className }) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {/* Header */}
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">SVG2TSX</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:grid md:grid-rows-[1fr_auto]">
        {/* Tabs Area */}
        <div className="flex-1 overflow-auto p-4">
          <TabsContainer />
        </div>

        {/* Output Area */}
        <div className="border-t">
          <TsxOutputPanel />
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="border-t p-4 flex gap-2">
        <CopyCodeButton />
        <SaveButton />
      </footer>
    </div>
  );
};
```

### 1.2 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────┐
│  [Header] SVG2TSX                                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┐                         │
│  │   Input  │  Preview │  Options │                         │
│  └──────────┴──────────┴──────────┘                         │
├─────────────────────────────────────────────────────────────┤
│  [Active Tab Content Area]                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Output: TSX Code Preview]                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Footer] [Copy Code] [Save as .tsx]                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. widgets 구현

### 2.1 svg-input-panel (입력 영역)

**파일 구조**:
- [ ] `src/widgets/svg-input-panel/ui/SvgInputPanel.tsx`
- [ ] `src/widgets/svg-input-panel/index.ts`

```typescript
// src/widgets/svg-input-panel/ui/SvgInputPanel.tsx
export interface SvgInputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onFileLoaded?: (content: string, fileName: string) => void;
}

export const SvgInputPanel: React.FC<SvgInputPanelProps> = ({
  value,
  onChange,
  onFileLoaded,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Drop Zone */}
      <DropZone onSvgLoaded={onFileLoaded} />

      {/* Or Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      {/* Text Input */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste SVG code here..."
        className="min-h-[300px] font-mono text-sm"
      />
    </div>
  );
};
```

**체크리스트**:
- [ ] Drop Zone 컴포넌트 통합
- [ ] 텍스트 입력 영역 (Textarea)
- [ ] "or" 구분선
- [ ] 실시간 입력 반영

### 2.2 tsx-output-panel (출력 영역)

```typescript
// src/widgets/tsx-output-panel/ui/TsxOutputPanel.tsx
export interface TsxOutputPanelProps {
  code: string;
  isLoading?: boolean;
  error?: string | null;
}

export const TsxOutputPanel: React.FC<TsxOutputPanelProps> = ({
  code,
  isLoading,
  error,
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Output</h3>
        <CopyCodeButton code={code} />
      </div>

      {error ? (
        <div className="text-destructive text-sm">{error}</div>
      ) : isLoading ? (
        <div className="text-muted-foreground">Converting...</div>
      ) : (
        <CodePreview code={code} language="tsx" />
      )}
    </div>
  );
};
```

**체크리스트**:
- [ ] 코드 하이라이팅 (prism-react-renderer)
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 복사 버튼 통합

### 2.3 options-panel (옵션 설정)

```typescript
// src/widgets/options-panel/ui/OptionsPanel.tsx
export interface OptionsPanelProps {
  options: ConversionOptions;
  onOptionsChange: (options: Partial<ConversionOptions>) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  options,
  onOptionsChange,
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Component Name */}
      <div className="space-y-2">
        <Label htmlFor="componentName">Component Name</Label>
        <Input
          id="componentName"
          value={options.componentName}
          onChange={(e) => onOptionsChange({ componentName: e.target.value })}
          placeholder="Icon"
        />
      </div>

      {/* TypeScript Toggle */}
      <OptionToggle
        id="typescript"
        label="TypeScript"
        description="Generate TypeScript types"
        checked={options.typescript}
        onCheckedChange={(checked) => onOptionsChange({ typescript: checked })}
      />

      {/* Memo Toggle */}
      <OptionToggle
        id="useMemo"
        label="React.memo"
        description="Wrap component with React.memo"
        checked={options.useMemo}
        onCheckedChange={(checked) => onOptionsChange({ useMemo: checked })}
      />

      {/* ForwardRef Toggle */}
      <OptionToggle
        id="useForwardRef"
        label="forwardRef"
        description="Support ref forwarding"
        checked={options.useForwardRef}
        onCheckedChange={(checked) => onOptionsChange({ useForwardRef: checked })}
      />
    </div>
  );
};
```

**체크리스트**:
- [ ] 컴포넌트 이름 입력
- [ ] TypeScript 토글
- [ ] React.memo 토글
- [ ] forwardRef 토글
- [ ] 최적화 옵션들 (P2)

---

## 3. features 구현

### 3.1 convert-svg (변환 기능)

```typescript
// src/features/convert-svg/ui/ConvertButton.tsx
export interface ConvertButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ConvertButton: React.FC<ConvertButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Converting...
        </>
      ) : (
        'Convert to TSX'
      )}
    </Button>
  );
};
```

### 3.2 copy-code (클립보드 복사)

```typescript
// src/features/copy-code/ui/CopyCodeButton.tsx
export interface CopyCodeButtonProps {
  code: string;
  className?: string;
}

export const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({
  code,
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      className={className}
      disabled={!code}
    >
      {isCopied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};
```

### 3.3 toggle-option (옵션 토글)

```typescript
// src/features/toggle-option/ui/OptionToggle.tsx
export interface OptionToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const OptionToggle: React.FC<OptionToggleProps> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};
```

---

## 4. Tab-based 레이아웃

### 4.1 shadcn/ui Tabs 설치

```bash
pnpm dlx shadcn@latest add tabs
```

### 4.2 TabsContainer 컴포넌트

```typescript
// src/pages/main/ui/TabsContainer.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export const TabsContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('input');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="input">
          <FileInput className="mr-2 h-4 w-4" />
          Input
        </TabsTrigger>
        <TabsTrigger value="preview">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="options">
          <Settings className="mr-2 h-4 w-4" />
          Options
        </TabsTrigger>
      </TabsList>

      <TabsContent value="input">
        <SvgInputPanel {...inputProps} />
      </TabsContent>

      <TabsContent value="preview">
        <SvgPreview svgContent={svgContent} />
      </TabsContent>

      <TabsContent value="options">
        <OptionsPanel {...optionsProps} />
      </TabsContent>
    </Tabs>
  );
};
```

**체크리스트**:
- [ ] 3개 탭 (Input, Preview, Options)
- [ ] 아이콘 추가 (lucide-react)
- [ ] 탭 전환 상태 관리
- [ ] 각 탭 콘텐츠 렌더링

---

## 5. 코드 미리보기 (prism-react-renderer)

### 5.1 설치

```bash
pnpm add prism-react-renderer
```

### 5.2 CodePreview 컴포넌트

```typescript
// src/shared/ui/code-preview.tsx
import { Highlight, themes } from 'prism-react-renderer';

export interface CodePreviewProps {
  code: string;
  language?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  language = 'tsx',
}) => {
  return (
    <Highlight
      theme={themes.vsDark}
      code={code}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            className,
            'rounded-lg p-4 overflow-auto text-sm font-mono'
          )}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="inline-block w-8 text-right mr-4 text-gray-500 select-none">
                {i + 1}
              </span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
```

**체크리스트**:
- [ ] prism-react-renderer 설치
- [ ] TSX 구문 하이라이팅
- [ ] 줄 번호 표시
- [ ] 다크 테마 적용
- [ ] 스크롤 가능

---

## 6. 반응형 UI

### 6.1 브레이크포인트

| 크기 | 레이아웃 |
|------|----------|
| >= 768px | 상하 분할 (탭 + 출력) |
| < 768px | 전체 탭 (Input, Preview, Options, Output) |

### 6.2 반응형 컨테이너

```typescript
// 데스크톱
<div className="hidden md:grid md:grid-rows-[1fr_auto] h-screen">
  {/* 탭 영역 */}
  <div className="overflow-auto p-4">
    <TabsContainer />
  </div>
  {/* 출력 영역 */}
  <div className="border-t max-h-[40vh] overflow-auto">
    <TsxOutputPanel />
  </div>
</div>

// 모바일
<div className="md:hidden flex flex-col h-screen">
  <Tabs defaultValue="input" className="flex-1">
    <TabsList className="grid grid-cols-4">
      <TabsTrigger value="input">Input</TabsTrigger>
      <TabsTrigger value="preview">Preview</TabsTrigger>
      <TabsTrigger value="options">Options</TabsTrigger>
      <TabsTrigger value="output">Output</TabsTrigger>
    </TabsList>
    {/* Tab Contents */}
  </Tabs>
</div>
```

---

## 7. 접근성 체크리스트

- [ ] 모든 인터랙티브 요소 Tab으로 접근 가능
- [ ] 각 입력 필드에 `<label>` 연결
- [ ] `aria-label` 적용 (아이콘 버튼)
- [ ] 포커스 시각적 표시 (`focus-visible:ring-2`)
- [ ] 색상만으로 정보 전달 금지

---

## 8. shadcn/ui 컴포넌트 설치

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add switch
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add textarea
```

---

## 9. 라이브러리 설치

```bash
pnpm add prism-react-renderer
pnpm add lucide-react
```

---

## 완료 기준

- [ ] MainPage 레이아웃 구현
- [ ] 3개 widgets 구현 (input, output, options)
- [ ] 3개 features 구현 (convert, copy, toggle)
- [ ] Tab-based 레이아웃 동작
- [ ] 코드 하이라이팅 동작
- [ ] 반응형 UI 동작 (768px 기준)
- [ ] 접근성 검증

---

## 다음 단계

- **Task 04**: 파일 입출력 및 Tauri 연동
- **Task 05**: 고급 기능 (테마, 단축키, 히스토리)

---

**작성일**: 2025-12-25
**버전**: 1.0.0
