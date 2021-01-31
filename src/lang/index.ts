import { en } from './en';
import { ja } from './ja';

export const lang =
  typeof navigator !== 'undefined' && navigator.language.slice(0, 2) === 'ja'
    ? ja
    : en;
