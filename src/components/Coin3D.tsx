
import { useState } from 'react';

export default function Coin3D({ 
  isAnimating = false,
  onClick = () => {}
}: { 
  isAnimating?: boolean;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative w-32 h-32 mx-auto transition-transform cursor-pointer ${isAnimating ? 'scale-95' : 'scale-100'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 shadow-lg transition-all duration-300 ${isHovered ? 'shadow-amber-400/40' : 'shadow-amber-400/20'}`}>
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 flex items-center justify-center border-4 border-amber-300/30">
          <span className="text-5xl font-bold text-amber-800">P</span>
          <div className="absolute inset-0 rounded-full border-2 border-amber-200/20"></div>
        </div>
        {/* Coin highlight effect */}
        <div className="absolute top-1/4 left-1/5 w-1/3 h-1/6 bg-white/20 rounded-full blur-sm"></div>
      </div>
    </div>
  );
}
