import React from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Sparkles, Baby } from 'lucide-react';

export function FloatingElements() {
  const elements = [
    { Icon: Heart, delay: 0, duration: 4, x: 20, y: -20 },
    { Icon: Star, delay: 1, duration: 5, x: -30, y: 30 },
    { Icon: Sparkles, delay: 2, duration: 3, x: 40, y: -40 },
    { Icon: Baby, delay: 3, duration: 6, x: -20, y: 20 },
    { Icon: Heart, delay: 4, duration: 4, x: 60, y: -10 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: [0, 360],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <element.Icon 
            className="w-6 h-6 text-primary/30" 
            style={{
              filter: 'drop-shadow(0 0 8px rgba(224, 107, 117, 0.3))'
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}