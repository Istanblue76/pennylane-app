import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', onClick, href, ...props }) => {
  const baseClasses = "font-semibold px-8 py-3 rounded-md transition-all duration-300 uppercase tracking-wider text-sm active:scale-95 text-center inline-block";
  const variants = {
    primary: "bg-secondary text-primary hover:bg-accent border-none",
    outline: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-primary",
  };

  const Component = href ? 'a' : 'button';

  return (
    <motion.div
       whileHover={{ scale: 1.05 }}
       whileTap={{ scale: 0.95 }}
    >
      <Component 
        href={href}
        className={`${baseClasses} ${variants[variant]} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
};

export default Button;
