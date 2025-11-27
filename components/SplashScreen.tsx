import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const SplashScreen: React.FC<Props> = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col items-center justify-center text-white z-50 transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="bg-white p-4 rounded-full shadow-2xl mb-6 animate-bounce">
        <GraduationCap size={64} className="text-blue-800" />
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 tracking-wide">Shivsadhana</h1>
      <p className="text-lg md:text-xl text-blue-100 font-light tracking-widest uppercase">Education Academy</p>
      <div className="mt-8 w-16 h-1 bg-blue-400 rounded-full"></div>
    </div>
  );
};

export default SplashScreen;
