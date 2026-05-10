import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 1, text: "Home", to: "home" },
    { id: 2, text: "Skills", to: "skills" },
    { id: 3, text: "Projects", to: "projects" },
    { id: 4, text: "Timeline", to: "timeline" },
    { id: 5, text: "Contact", to: "contact" },
  ];

  // Variants for the top navbar container
  const navVariants = {
    hidden: { opacity: 0, y: -80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Staggered animation for desktop menu items
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

// ... inside the Desktop Menu mapping:
{menuItems.map((item, index) => (
  <motion.div
    key={item.id}
    custom={index}
    variants={itemVariants}
    initial="hidden"
    animate="visible"
  >
    {/* ADD THIS CONTAINER FOR HOME ITEM BORDER */}
    <div className="relative">
      <Link
        to={item.to}
        smooth={true}
        duration={500}
        className="relative cursor-pointer text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium px-4 py-2 group"
      >
        {item.text}
        {/* ... other hover effects */}
      </Link>

      {/* ANIMATED BORDER ONLY FOR HOME */}
      {item.text === "Home" && (
        <motion.span
          className="absolute inset-0 rounded-lg border-2 border-blue-400/70 pointer-events-none"
          animate={{ scale: [1, 1.06, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      )}
    </div>
  </motion.div>
))}


  // Mobile menu container variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, when: "afterChildren", staggerChildren: 0.03, staggerDirection: -1 },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="fixed w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Futuristic Animated Logo */}
          <div className="flex-shrink-0 cursor-pointer group">
            <motion.h1
              className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] inline-flex items-center gap-1"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Ansh
              <motion.span
                className="text-blue-500"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                .Dev
              </motion.span>
              {/* Scanning line effect on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent w-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
              />
            </motion.h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={item.to}
                    smooth={true}
                    duration={300}
                    className="relative cursor-pointer text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium px-4 py-2 group"
                  >
                    {item.text}
                    {/* Animated futuristic underline */}
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileHover={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ originX: 0.5 }}
                    />
                    {/* Hover glow ring */}
                    <motion.span
                      className="absolute inset-0 rounded-lg border border-blue-400/0"
                      whileHover={{
                        borderColor: "rgba(59,130,246,0.4)",
                        boxShadow: "0 0 12px rgba(59,130,246,0.3)",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>



          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-500 transition-colors p-2 relative"
              whileTap={{ scale: 0.9 }}
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
              {/* Button glow effect */}
              <motion.span
                className="absolute inset-0 rounded-full border border-blue-500/30"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0.3, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.button>
          </div>
        </div>
      </div>




      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-black/95 border-b border-gray-800 overflow-hidden backdrop-blur-xl"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={mobileItemVariants}
                >
                  <Link
                    to={item.to}
                    smooth={true}
                    duration={500}
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium relative group"
                  >
                    {item.text}
                    {/* Mobile item underline */}
                    <motion.span
                      className="absolute bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;