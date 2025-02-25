
import { motion } from "framer-motion";

export const Welcome = ({ name }: { name?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-8 p-8 rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-transparent backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-primary/5 transition-all"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center relative"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl"
        />
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
          Welcome back!
        </h2>
        <motion.p
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-4xl font-semibold bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent"
        >
          {name || "Member"}
        </motion.p>
        <p className="text-muted-foreground mt-4 text-lg">Ready for another great workout? 💪</p>
      </motion.div>
    </motion.div>
  );
};
