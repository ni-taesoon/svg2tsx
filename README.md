# SVG2TSX

SVG 파일을 React TSX 컴포넌트로 변환하는 Tauri v2 기반 데스크톱 애플리케이션

## 주요 기능

- **다양한 입력 방식**: 드래그 앤 드롭, 파일 선택, 텍스트 붙여넣기
- **실시간 미리보기**: SVG 렌더링 및 TSX 코드 미리보기
- **SVG 최적화**: 불필요한 속성 제거, ID/Class 정리 등
- **TSX 변환 옵션**: memo, forwardRef, 컴포넌트 타입 선택
- **클립보드 복사 & 파일 저장**: 원클릭 복사 및 .tsx 파일 저장
- **다중 언어 지원**: 한국어/영어 UI 메시지 (i18n)

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 19, TypeScript 5, Vite 7 |
| Desktop | Tauri v2, Rust |
| Styling | Tailwind CSS 4, shadcn/ui |
| Testing | Vitest, React Testing Library, Playwright |

## 시작하기

### 요구 사항

- [Node.js](https://nodejs.org/) 18+
- [Bun](https://bun.sh/)
- [Rust](https://www.rust-lang.org/tools/install)

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/svg2tsx.git
cd svg2tsx

# 의존성 설치
bun install
```

### 개발

```bash
# Tauri 앱 실행 (Rust + Frontend)
bun run tauri dev

# Frontend만 실행
bun run dev
```

### 언어 설정

기본 언어는 브라우저/OS 언어를 따라갑니다.

- 앱 우측 상단 언어 버튼에서 한국어/영어를 즉시 전환할 수 있습니다.
- 선택한 언어는 `localStorage`(`svg2tsx-lang`)에 저장됩니다.
- 개발 시에는 아래 방식으로 초기 언어를 강제할 수 있습니다.

```bash
# 영어 강제
VITE_APP_LANG=en bun run dev

# 한국어 강제
VITE_APP_LANG=ko bun run dev
```

또는 URL 쿼리로 `lang` 값을 지정할 수 있습니다.

```text
http://localhost:1420/?lang=en
```

### 빌드

```bash
# 프로덕션 빌드
bun run tauri build
```

### 테스트

```bash
# 유닛 테스트
bun run test

# E2E 테스트
bun run test:e2e
```

## 프로젝트 구조

[Feature-Sliced Design](https://feature-sliced.design/) 아키텍처를 따릅니다.

```
src/
├── app/        # 앱 초기화, providers
├── pages/      # 페이지 컴포넌트
├── widgets/    # 조합된 UI 블록
├── features/   # 사용자 기능
├── entities/   # 비즈니스 엔티티
└── shared/     # 공유 코드 (ui, api)
```

## 라이선스

MIT
