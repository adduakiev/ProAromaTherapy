import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex justify-center py-4 bg-white shadow-sm sticky top-0 z-10">
      <img 
        src="https://res2.weblium.site/res/64af11955fe767000f09e56e/64b57ee9ef56ec000f438291_optimized.webp" 
        alt="Logo" 
        className="h-12 object-contain"
      />
    </div>
  );
};