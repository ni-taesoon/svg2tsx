/**
 * 변환 옵션 상태 타입 정의
 *
 * Task02에서 구현, Task03에서 사용하는 공유 인터페이스
 */

import type { GeneratorOptions } from '../../tsx/model/types';
import type { OptimizerOptions } from '../../svg/model/types';

/** 전체 변환 옵션 (Generator + Optimizer 통합) */
export interface ConversionOptions extends GeneratorOptions {
  /** 최적화 적용 여부 (기본값: true) */
  optimize?: boolean;
}

/** 옵션 스토어 상태 */
export interface OptionsState {
  /** 변환 옵션 */
  options: ConversionOptions;
  /** 최적화 옵션 */
  optimizationOptions: OptimizerOptions;
  /** 변환 옵션 업데이트 */
  setOptions: (options: Partial<ConversionOptions>) => void;
  /** 최적화 옵션 업데이트 */
  setOptimizationOptions: (options: Partial<OptimizerOptions>) => void;
  /** 기본값으로 리셋 */
  reset: () => void;
}

/** 기본 변환 옵션 */
export const DEFAULT_CONVERSION_OPTIONS: ConversionOptions = {
  componentName: 'Icon',
  typescript: true,
  spreadProps: true,
  useMemo: false,
  useForwardRef: false,
  optimize: true,
};

/** 기본 최적화 옵션 */
export const DEFAULT_OPTIMIZER_OPTIONS: OptimizerOptions = {
  removeDataAttrs: true,
  removeIds: false,
  removeEmptyGroups: true,
  mergeDuplicateAttrs: true,
  removeDefaultAttrs: true,
  optimizeTransforms: true,
};
