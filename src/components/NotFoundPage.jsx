import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Fixed mouse tracking with proper coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get the position relative to the viewport
      const rect = document.documentElement.getBoundingClientRect();
      setMousePosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate particles
  useEffect(() => {
    const particleArray = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5
    }));
    setParticles(particleArray);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        staggerChildren: 0.15,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      rotate: [-8, 8, -8],
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 25,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2.5,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 30px rgba(59, 130, 246, 0.4)",
        "0 0 60px rgba(59, 130, 246, 0.8)",
        "0 0 30px rgba(59, 130, 246, 0.4)"
      ],
      filter: [
        "blur(0px)",
        "blur(1px)",
        "blur(0px)"
      ],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  const waveVariants = {
    animate: {
      pathLength: [0, 1, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [0, 1.5, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 3
      }
    }
  };

  const rippleVariants = {
    animate: {
      scale: [1, 3, 1],
      opacity: [0.6, 0, 0.6],
      transition: {
        duration: 4,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Grid */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-blue-400 rounded-full pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [-50, 50, -50],
              x: [-30, 30, -30],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: particle.delay,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Orbiting Elements with Enhanced Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={orbitVariants}
        animate="animate"
      >
        {/* Multiple orbiting rings */}
        <motion.div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-60" variants={sparkleVariants} animate="animate" />
        <motion.div className="absolute top-3/4 right-1/4 w-6 h-6 bg-blue-500 rounded-full opacity-40" variants={sparkleVariants} animate="animate" />
        <motion.div className="absolute top-1/2 left-1/6 w-2 h-2 bg-blue-600 rounded-full opacity-80" variants={sparkleVariants} animate="animate" />
        <motion.div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-300 rounded-full opacity-50" variants={sparkleVariants} animate="animate" />
        <motion.div className="absolute top-1/6 right-1/6 w-5 h-5 bg-blue-200 rounded-full opacity-70" variants={sparkleVariants} animate="animate" />
        <motion.div className="absolute bottom-1/6 left-1/3 w-2 h-2 bg-blue-700 rounded-full opacity-60" variants={sparkleVariants} animate="animate" />
      </motion.div>

      {/* Enhanced Floating Shapes */}
      <motion.div
        className="absolute top-20 left-20 w-20 h-20 border-3 border-blue-200 rounded-xl opacity-30"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '0s' }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-40"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-12 h-12 border-3 border-blue-300 rotate-45 opacity-20 rounded-lg"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '4s' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-8 h-20 bg-gradient-to-t from-blue-200 to-transparent rounded-full opacity-30"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '1s' }}
      />

      {/* Ripple Effects */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-blue-300 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        variants={rippleVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-48 h-48 border border-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        variants={rippleVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
      />

      {/* Wave SVG Animation */}
      <svg className="absolute bottom-0 left-0 w-full h-32 pointer-events-none" viewBox="0 0 1200 120" fill="none">
        <motion.path
          d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
          fill="rgba(59, 130, 246, 0.1)"
          variants={waveVariants}
          animate="animate"
        />
      </svg>

      {/* Fixed Interactive Mouse Follower */}
      <motion.div
        className="fixed w-6 h-6 bg-blue-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 12, // Center the dot
          top: mousePosition.y - 12,  // Center the dot
        }}
        transition={{
          type: "spring",
          stiffness: 150,  // Reduced for smoother movement
          damping: 15,     // Reduced for smoother movement
          mass: 0.1       // Added for better physics
        }}
      />

      {/* Main Content with Enhanced Animations */}
      <motion.div
        className="text-center z-10 px-6 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced 404 Number */}
        <motion.div
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.h1
            className="text-9xl md:text-[12rem] font-black text-blue-500 relative select-none"
            variants={pulseVariants}
            animate="animate"
            whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
          >
            <motion.span
              className="inline-block"
              animate={{
                rotateY: [0, 360],
                color: ["#3b82f6", "#1e40af", "#6366f1", "#3b82f6"]
              }}
              transition={{
                rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                color: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              4
            </motion.span>
            <motion.span
              className="inline-block"
              animate={{
                scale: [1, 1.2, 1],
                rotateX: [0, 360],
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
                rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            >
              0
            </motion.span>
            <motion.span
              className="inline-block"
              animate={{
                rotateZ: [0, 360],
                color: ["#3b82f6", "#6366f1", "#1e40af", "#3b82f6"]
              }}
              transition={{
                rotateZ: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 },
                color: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            >
              4
            </motion.span>
            
            {/* Multiple Glow Layers */}
            <motion.div
              className="absolute inset-0 text-9xl md:text-[12rem] font-black text-blue-500 -z-10"
              variants={glowVariants}
              animate="animate"
            >
              404
            </motion.div>
          </motion.h1>

          {/* Sparkles around 404 */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 40}%`,
                left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 40}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Enhanced Error Message */}
        <motion.div variants={itemVariants}>
         
          <motion.p 
            className="text-xl mt-40 text-gray-600 mb-10 leading-relaxed"
            animate={{ 
              y: [0, -5, 0],
              opacity: [0.8, 1, 0.8] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            The page you're looking for seems to have been swept away by a digital tornado. 
            Let's get you back on track!
          </motion.p>
        </motion.div>

        {/* Super Enhanced Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl relative overflow-hidden"
            whileHover={{ 
              scale: 1.08,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 10px 25px rgba(59, 130, 246, 0.2)",
                "0 15px 35px rgba(59, 130, 246, 0.3)",
                "0 10px 25px rgba(59, 130, 246, 0.2)"
              ]
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Go Home
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"
              whileHover={{ opacity: 0.1 }}
            />
          </motion.button>
          
          <motion.button
            onClick={() => navigate(-1)}
            className="bg-white hover:bg-gray-50 text-blue-500 px-10 py-4 rounded-xl font-semibold border-3 border-blue-500 transition-all duration-300 shadow-xl relative overflow-hidden"
            whileHover={{ 
              scale: 1.08,
              backgroundColor: "#f8fafc",
              borderColor: "#1e40af",
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              borderColor: ["#3b82f6", "#1e40af", "#6366f1", "#3b82f6"],
            }}
            transition={{
              borderColor: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.span
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Go Back
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Enhanced Help Text */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-gray-500 text-base"
        >
          <motion.p
            animate={{ 
              opacity: [0.7, 1, 0.7],
              y: [0, -2, 0] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            Lost in the digital maze? Check the URL or try our navigation menu! 🧭
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;