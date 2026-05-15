import { useContext } from 'react';
import { ToastContext, type ToastFn } from '../context/ToastContext';

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
