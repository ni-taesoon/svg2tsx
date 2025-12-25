/**
 * Options Store 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useOptionsStore } from '../model/store';
import { DEFAULT_CONVERSION_OPTIONS, DEFAULT_OPTIMIZER_OPTIONS } from '../model/types';

describe('useOptionsStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    useOptionsStore.getState().reset();
  });

  describe('초기 상태', () => {
    it('기본 변환 옵션으로 초기화되어야 함', () => {
      const { options } = useOptionsStore.getState();

      expect(options).toEqual(DEFAULT_CONVERSION_OPTIONS);
      expect(options.componentName).toBe('Icon');
      expect(options.typescript).toBe(true);
      expect(options.spreadProps).toBe(true);
      expect(options.useMemo).toBe(false);
      expect(options.useForwardRef).toBe(false);
      expect(options.optimize).toBe(true);
    });

    it('기본 최적화 옵션으로 초기화되어야 함', () => {
      const { optimizationOptions } = useOptionsStore.getState();

      expect(optimizationOptions).toEqual(DEFAULT_OPTIMIZER_OPTIONS);
      expect(optimizationOptions.removeDataAttrs).toBe(true);
      expect(optimizationOptions.removeIds).toBe(false);
      expect(optimizationOptions.removeEmptyGroups).toBe(true);
      expect(optimizationOptions.mergeDuplicateAttrs).toBe(true);
      expect(optimizationOptions.removeDefaultAttrs).toBe(true);
      expect(optimizationOptions.optimizeTransforms).toBe(true);
    });
  });

  describe('setOptions', () => {
    it('변환 옵션을 부분적으로 업데이트할 수 있어야 함', () => {
      const { setOptions } = useOptionsStore.getState();

      setOptions({ componentName: 'MyIcon' });

      const { options } = useOptionsStore.getState();
      expect(options.componentName).toBe('MyIcon');
      expect(options.typescript).toBe(true); // 다른 옵션은 유지
    });

    it('여러 옵션을 한 번에 업데이트할 수 있어야 함', () => {
      const { setOptions } = useOptionsStore.getState();

      setOptions({
        componentName: 'CustomIcon',
        typescript: false,
        useMemo: true,
      });

      const { options } = useOptionsStore.getState();
      expect(options.componentName).toBe('CustomIcon');
      expect(options.typescript).toBe(false);
      expect(options.useMemo).toBe(true);
      expect(options.spreadProps).toBe(true); // 업데이트하지 않은 값은 유지
    });

    it('빈 객체로 호출해도 에러가 발생하지 않아야 함', () => {
      const { setOptions } = useOptionsStore.getState();

      expect(() => setOptions({})).not.toThrow();

      const { options } = useOptionsStore.getState();
      expect(options).toEqual(DEFAULT_CONVERSION_OPTIONS);
    });
  });

  describe('setOptimizationOptions', () => {
    it('최적화 옵션을 부분적으로 업데이트할 수 있어야 함', () => {
      const { setOptimizationOptions } = useOptionsStore.getState();

      setOptimizationOptions({ removeIds: true });

      const { optimizationOptions } = useOptionsStore.getState();
      expect(optimizationOptions.removeIds).toBe(true);
      expect(optimizationOptions.removeDataAttrs).toBe(true); // 다른 옵션은 유지
    });

    it('여러 옵션을 한 번에 업데이트할 수 있어야 함', () => {
      const { setOptimizationOptions } = useOptionsStore.getState();

      setOptimizationOptions({
        removeIds: true,
        removeDataAttrs: false,
        optimizeTransforms: false,
      });

      const { optimizationOptions } = useOptionsStore.getState();
      expect(optimizationOptions.removeIds).toBe(true);
      expect(optimizationOptions.removeDataAttrs).toBe(false);
      expect(optimizationOptions.optimizeTransforms).toBe(false);
      expect(optimizationOptions.removeEmptyGroups).toBe(true); // 업데이트하지 않은 값은 유지
    });
  });

  describe('reset', () => {
    it('모든 옵션을 기본값으로 리셋해야 함', () => {
      const { setOptions, setOptimizationOptions, reset } = useOptionsStore.getState();

      // 옵션 변경
      setOptions({ componentName: 'CustomIcon', typescript: false });
      setOptimizationOptions({ removeIds: true, removeDataAttrs: false });

      // 리셋
      reset();

      const { options, optimizationOptions } = useOptionsStore.getState();
      expect(options).toEqual(DEFAULT_CONVERSION_OPTIONS);
      expect(optimizationOptions).toEqual(DEFAULT_OPTIMIZER_OPTIONS);
    });

    it('리셋 후에도 스토어가 정상 작동해야 함', () => {
      const { setOptions, reset } = useOptionsStore.getState();

      reset();
      setOptions({ componentName: 'NewIcon' });

      const { options } = useOptionsStore.getState();
      expect(options.componentName).toBe('NewIcon');
    });
  });

  describe('상태 구독', () => {
    it('상태 변경 시 구독자에게 알림이 가야 함', () => {
      let callCount = 0;
      let lastState = useOptionsStore.getState();

      const unsubscribe = useOptionsStore.subscribe((state) => {
        callCount++;
        lastState = state;
      });

      const { setOptions } = useOptionsStore.getState();
      setOptions({ componentName: 'TestIcon' });

      expect(callCount).toBeGreaterThan(0);
      expect(lastState.options.componentName).toBe('TestIcon');

      unsubscribe();
    });
  });

  describe('엣지 케이스', () => {
    it('존재하지 않는 옵션을 설정해도 에러가 발생하지 않아야 함', () => {
      const { setOptions } = useOptionsStore.getState();

      expect(() => setOptions({ invalidOption: true } as any)).not.toThrow();
    });

    it('undefined 값으로 업데이트하면 무시되어야 함', () => {
      const { setOptions } = useOptionsStore.getState();

      setOptions({ componentName: 'TestIcon' });
      setOptions({ componentName: undefined });

      const { options } = useOptionsStore.getState();
      expect(options.componentName).toBe('TestIcon'); // 변경되지 않음
    });
  });
});
