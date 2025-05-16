
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function Coin3D({ 
  isAnimating = false,
  onClick = () => {}
}: { 
  isAnimating?: boolean;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  // Add rotation animation
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setRotation(prev => (prev + 0.5) % 360);
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [rotation]);
  
  return (
    <div 
      className={`relative w-32 h-32 mx-auto transition-all duration-300 cursor-pointer 
        ${isAnimating ? 'scale-95' : 'scale-100'}
        ${isHovered ? 'transform-gpu rotate-y-12' : ''}
      `}
      style={{
        transform: `rotateY(${rotation / 10}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 shadow-lg transition-all duration-300 ${isHovered ? 'shadow-amber-400/60' : 'shadow-amber-400/20'}`}>
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 flex items-center justify-center border-4 border-amber-300/30">
          <span className="text-5xl font-bold text-amber-800 animate-pulse">P</span>
          <div className="absolute inset-0 rounded-full border-2 border-amber-200/20"></div>
        </div>
        {/* Coin highlight effect */}
        <div className="absolute top-1/4 left-1/5 w-1/3 h-1/6 bg-white/30 rounded-full blur-sm"></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-2 right-4 animate-pulse">
          <Sparkles className="h-3 w-3 text-yellow-200" />
        </div>
        <div className="absolute bottom-3 left-5 animate-pulse delay-150">
          <Sparkles className="h-2 w-2 text-yellow-100" />
        </div>
      </div>
      
      {/* Edge effect */}
      <div className="absolute inset-0 rounded-full border-r-4 border-amber-600/30"></div>
    </div>
  );
}
