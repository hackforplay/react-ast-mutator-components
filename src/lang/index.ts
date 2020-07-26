import { en } from './en';
import { ja } from './ja';

export const lang = navigator.language.slice(0, 2) === 'ja' ? ja : en;
