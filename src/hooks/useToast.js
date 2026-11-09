import { useContext } from 'react';
import { ToastCtx } from '../context/toast';

export default function useToast() {
  return useContext(ToastCtx);
}
