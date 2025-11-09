import { motion } from 'framer-motion'

export default function Animate({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="min-h-[calc(100vh-4rem)]"
    >
      {children}
    </motion.div>
  );
}
