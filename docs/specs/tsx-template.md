# TSX 출력 템플릿

> PRD.md 섹션 7.2에서 분리

## 기본 템플릿 (Full Options)

```tsx
import { SVGProps, memo, forwardRef } from 'react';

interface IconNameProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const IconName = forwardRef<SVGSVGElement, IconNameProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {/* SVG 내용 */}
    </svg>
  )
);

IconName.displayName = 'IconName';

export default memo(IconName);
```

## 옵션별 변형

### 1. 기본 (forwardRef 없음, memo 없음)

```tsx
import { SVGProps } from 'react';

interface IconNameProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const IconName = ({ size = 24, ...props }: IconNameProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    {/* SVG 내용 */}
  </svg>
);

export default IconName;
```

### 2. memo만 적용

```tsx
import { SVGProps, memo } from 'react';

interface IconNameProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const IconName = ({ size = 24, ...props }: IconNameProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    {/* SVG 내용 */}
  </svg>
);

export default memo(IconName);
```

### 3. forwardRef만 적용

```tsx
import { SVGProps, forwardRef } from 'react';

interface IconNameProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const IconName = forwardRef<SVGSVGElement, IconNameProps>(
  ({ size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {/* SVG 내용 */}
    </svg>
  )
);

IconName.displayName = 'IconName';

export default IconName;
```

### 4. Named Export

```tsx
import { SVGProps } from 'react';

interface IconNameProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const IconName = ({ size = 24, ...props }: IconNameProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    {/* SVG 내용 */}
  </svg>
);
```

## 템플릿 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `IconName` | PascalCase 컴포넌트명 | `ArrowRight`, `CheckCircle` |
| `viewBox` | 원본 SVG의 viewBox 유지 | `"0 0 24 24"` |
| `size` | 기본 크기 (width/height 중 큰 값) | `24` |
| `fill` | 기본 fill 값 (옵션에 따라) | `"none"` 또는 `"currentColor"` |

## 옵션 조합 표

| forwardRef | memo | displayName 필요 |
|------------|------|-----------------|
| ❌ | ❌ | ❌ |
| ❌ | ✅ | ❌ |
| ✅ | ❌ | ✅ |
| ✅ | ✅ | ✅ |
