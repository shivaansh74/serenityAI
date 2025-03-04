import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-lightest">
      <motion.div
        className="w-16 h-16 mb-4"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1] 
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </motion.div>
      <p className="text-neutral-dark text-lg">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
