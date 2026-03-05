import { motion } from "framer-motion";

// Add this component above your Login function:
export default function FloatingCircles() {
  const circles = [
    { size: 300, x: -100, y: -100, duration: 6, delay: 0 },
    { size: 200, x: "80vw", y: "70vh", duration: 8, delay: 1 },
    { size: 150, x: "60vw", y: -50, duration: 7, delay: 2 },
    { size: 100, x: 50, y: "60vh", duration: 5, delay: 0.5 },
    { size: 250, x: "40vw", y: "80vh", duration: 9, delay: 1.5 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {circles.map((circle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#f34700] opacity-10"
          style={{
            width: circle.size,
            height: circle.size,
            left: circle.x,
            top: circle.y,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}