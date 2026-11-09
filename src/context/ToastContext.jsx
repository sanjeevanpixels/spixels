import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SPRING } from '../lib/motion';
import { ToastCtx } from './toast';

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timer = useRef();

  const toast = useCallback((m) => {
    setMsg(m);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 3000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <motion.div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-hidden={!show}
        initial={false}
        style={{ x: '-50%' }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
        transition={SPRING}
        className="fixed bottom-24 left-1/2 z-[70] bg-[#0D0F17] dark:bg-white text-white dark:text-[#0D0F17] text-sm font-medium px-5 py-3 rounded-full shadow-xl pointer-events-none"
      >
        {msg}
      </motion.div>
    </ToastCtx.Provider>
  );
}
