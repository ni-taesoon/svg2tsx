import { test, expect } from '@playwright/test';

const SAMPLE_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
</svg>`;

test.describe('SVG to TSX 변환 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지가 정상적으로 로드됨', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('SVG2TSX');
    await expect(page.locator('text=Convert SVG to React TSX components')).toBeVisible();
  });

  test('SVG 입력 및 변환', async ({ page }) => {
    // Input 탭에서 SVG 입력
    const textarea = page.locator('[data-testid="svg-input"]');
    await textarea.fill(SAMPLE_SVG);

    // 변환 버튼 클릭
    await page.click('button:has-text("Convert")');

    // 결과 확인 (코드에 export const가 포함되어 있어야 함)
    await expect(page.locator('text=export const')).toBeVisible({ timeout: 5000 });
  });

  test('탭 전환이 정상 동작', async ({ page }) => {
    // Preview 탭 클릭
    await page.click('button:has-text("Preview")');
    await expect(page.locator('text=No SVG content to preview')).toBeVisible();

    // Options 탭 클릭
    await page.click('button:has-text("Options")');
    await expect(page.locator('text=SVG 최적화')).toBeVisible();

    // Input 탭으로 돌아가기
    await page.click('button:has-text("Input")');
    await expect(page.locator('[data-testid="svg-input"]')).toBeVisible();
  });

  test('테마 전환', async ({ page }) => {
    // 테마 토글 버튼 클릭
    await page.click('[data-testid="theme-toggle"]');

    // Light 선택
    await page.click('text=Light');

    // html에 light 클래스가 적용되었는지 확인
    await expect(page.locator('html')).toHaveClass(/light/);

    // 다시 테마 토글
    await page.click('[data-testid="theme-toggle"]');
    await page.click('text=Dark');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('옵션 변경이 저장됨', async ({ page }) => {
    // Options 탭으로 이동
    await page.click('button:has-text("Options")');

    // React.memo 토글
    const memoSwitch = page.locator('text=React.memo').locator('..').locator('button[role="switch"]');
    await memoSwitch.click();

    // 토글이 활성화되었는지 확인
    await expect(memoSwitch).toHaveAttribute('data-state', 'checked');

    // 페이지 새로고침
    await page.reload();

    // Options 탭으로 다시 이동
    await page.click('button:has-text("Options")');

    // 설정이 유지되었는지 확인 (localStorage persist)
    await expect(memoSwitch).toHaveAttribute('data-state', 'checked');
  });
});

test.describe('단축키', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('? 키로 도움말 모달 표시', async ({ page }) => {
    await page.keyboard.press('?');
    await expect(page.locator('text=키보드 단축키')).toBeVisible();
  });

  test('Cmd/Ctrl + 1/2/3으로 탭 전환', async ({ page }) => {
    const isMac = process.platform === 'darwin';
    const modifier = isMac ? 'Meta' : 'Control';

    // Cmd/Ctrl + 2 (Preview 탭)
    await page.keyboard.press(`${modifier}+2`);
    await expect(page.locator('text=No SVG content to preview')).toBeVisible();

    // Cmd/Ctrl + 3 (Options 탭)
    await page.keyboard.press(`${modifier}+3`);
    await expect(page.locator('text=SVG 최적화')).toBeVisible();

    // Cmd/Ctrl + 1 (Input 탭)
    await page.keyboard.press(`${modifier}+1`);
    await expect(page.locator('[data-testid="svg-input"]')).toBeVisible();
  });
});
