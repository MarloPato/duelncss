import { createContext } from 'react';

export type ToastFn = (message: string, type?: string, duration?: number) => void;

export const ToastContext = createContext<ToastFn | null>(null);
