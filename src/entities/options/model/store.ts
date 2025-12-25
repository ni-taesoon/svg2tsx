/**
 * Options Store
 *
 * Zustand 기반 변환 옵션 상태 관리
 * localStorage에 자동 저장/복원
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OptionsState, ConversionOptions } from './types';
import { DEFAULT_CONVERSION_OPTIONS, DEFAULT_OPTIMIZER_OPTIONS } from './types';
import type { OptimizerOptions } from '@/entities/svg/model/types';

/**
 * 옵션 스토어 (persist 적용)
 * - localStorage key: 'svg2tsx-options'
 * - 앱 재시작 시 자동 복원
 */
export const useOptionsStore = create<OptionsState>()(
  persist(
    (set) => ({
      options: DEFAULT_CONVERSION_OPTIONS,
      optimizationOptions: DEFAULT_OPTIMIZER_OPTIONS,

      setOptions: (newOptions: Partial<ConversionOptions>) => {
        set((state) => ({
          options: {
            ...state.options,
            ...Object.fromEntries(Object.entries(newOptions).filter(([_, v]) => v !== undefined)),
          },
        }));
      },

      setOptimizationOptions: (newOptions: Partial<OptimizerOptions>) => {
        set((state) => ({
          optimizationOptions: {
            ...state.optimizationOptions,
            ...Object.fromEntries(Object.entries(newOptions).filter(([_, v]) => v !== undefined)),
          },
        }));
      },

      reset: () => {
        set({
          options: DEFAULT_CONVERSION_OPTIONS,
          optimizationOptions: DEFAULT_OPTIMIZER_OPTIONS,
        });
      },
    }),
    {
      name: 'svg2tsx-options',
    }
  )
);
