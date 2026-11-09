import { CFG } from '../data/config';
import useToast from './useToast';

export default function useCopyEmail() {
  const toast = useToast();
  return async () => {
    try {
      await navigator.clipboard.writeText(CFG.email);
      toast('Email copied');
    } catch {
      toast(CFG.email);
    }
  };
}
