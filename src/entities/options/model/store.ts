/**
 * Options Store
 *
 * Zustand 기반 변환 옵션 상태 관리
 */

import { create } from 'zustand';
import type {
  OptionsState,
  ConversionOptions,
} from './types';
import {
  DEFAULT_CONVERSION_OPTIONS,
  DEFAULT_OPTIMIZER_OPTIONS,
} from './types';
import type { OptimizerOptions } from '@/entities/svg/model/types';

/**
 * 옵션 스토어
 */
export const useOptionsStore = create<OptionsState>((set) => ({
  options: DEFAULT_CONVERSION_OPTIONS,
  optimizationOptions: DEFAULT_OPTIMIZER_OPTIONS,

  setOptions: (newOptions: Partial<ConversionOptions>) => {
    set((state) => ({
      options: {
        ...state.options,
        ...Object.fromEntries(
          Object.entries(newOptions).filter(([_, v]) => v !== undefined)
        ),
      },
    }));
  },

  setOptimizationOptions: (newOptions: Partial<OptimizerOptions>) => {
    set((state) => ({
      optimizationOptions: {
        ...state.optimizationOptions,
        ...Object.fromEntries(
          Object.entries(newOptions).filter(([_, v]) => v !== undefined)
        ),
      },
    }));
  },

  reset: () => {
    set({
      options: DEFAULT_CONVERSION_OPTIONS,
      optimizationOptions: DEFAULT_OPTIMIZER_OPTIONS,
    });
  },
}));
