# SVG → TSX 속성 변환 규칙

> PRD.md 섹션 7.1에서 분리

## 기본 변환 규칙

| SVG 속성 | TSX 속성 | 설명 |
|----------|----------|------|
| `class` | `className` | React의 className 사용 |
| `fill-rule` | `fillRule` | kebab-case → camelCase |
| `clip-rule` | `clipRule` | kebab-case → camelCase |
| `stroke-width` | `strokeWidth` | kebab-case → camelCase |
| `stroke-linecap` | `strokeLinecap` | kebab-case → camelCase |
| `stroke-linejoin` | `strokeLinejoin` | kebab-case → camelCase |
| `font-size` | `fontSize` | kebab-case → camelCase |
| `text-anchor` | `textAnchor` | kebab-case → camelCase |
| `xlink:href` | `href` | xlinkHref는 deprecated |

## 변환 패턴

### 1. class → className
```tsx
// Before (SVG)
<svg class="icon primary"></svg>

// After (TSX)
<svg className="icon primary"></svg>
```

### 2. kebab-case → camelCase
```tsx
// Before (SVG)
<path stroke-width="2" stroke-linecap="round"></path>

// After (TSX)
<path strokeWidth="2" strokeLinecap="round"></path>
```

### 3. xlink:href → href
```tsx
// Before (SVG)
<use xlink:href="#icon"></use>

// After (TSX)
<use href="#icon"></use>
```

## 추가 kebab-case 속성 목록

다음 속성들도 camelCase로 변환 필요:

- `alignment-baseline` → `alignmentBaseline`
- `baseline-shift` → `baselineShift`
- `clip-path` → `clipPath`
- `color-interpolation` → `colorInterpolation`
- `dominant-baseline` → `dominantBaseline`
- `enable-background` → `enableBackground`
- `fill-opacity` → `fillOpacity`
- `flood-color` → `floodColor`
- `flood-opacity` → `floodOpacity`
- `font-family` → `fontFamily`
- `font-style` → `fontStyle`
- `font-weight` → `fontWeight`
- `glyph-name` → `glyphName`
- `horiz-adv-x` → `horizAdvX`
- `letter-spacing` → `letterSpacing`
- `lighting-color` → `lightingColor`
- `marker-end` → `markerEnd`
- `marker-mid` → `markerMid`
- `marker-start` → `markerStart`
- `overline-position` → `overlinePosition`
- `overline-thickness` → `overlineThickness`
- `paint-order` → `paintOrder`
- `stop-color` → `stopColor`
- `stop-opacity` → `stopOpacity`
- `strikethrough-position` → `strikethroughPosition`
- `strikethrough-thickness` → `strikethroughThickness`
- `stroke-dasharray` → `strokeDasharray`
- `stroke-dashoffset` → `strokeDashoffset`
- `stroke-miterlimit` → `strokeMiterlimit`
- `stroke-opacity` → `strokeOpacity`
- `text-decoration` → `textDecoration`
- `transform-origin` → `transformOrigin`
- `underline-position` → `underlinePosition`
- `underline-thickness` → `underlineThickness`
- `word-spacing` → `wordSpacing`
- `writing-mode` → `writingMode`
