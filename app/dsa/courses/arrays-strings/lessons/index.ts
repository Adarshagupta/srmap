import { TWO_SUM } from './two-sum';
import { MAX_SUBARRAY } from './max-subarray';
import { SLIDING_WINDOW } from './sliding-window';
import { Lesson } from '@/app/dsa/content';

export const ARRAYS_STRINGS_LESSONS: Record<string, Record<number, Lesson>> = {
  '1': {
    1: TWO_SUM,
    2: MAX_SUBARRAY,
    3: SLIDING_WINDOW,
  },
}; 