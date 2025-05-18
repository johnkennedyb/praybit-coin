
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls, useProgress, Html, Text } from '@react-three/drei';
import { Sparkles } from 'lucide-react';

interface CoinSceneProps {
  isAnimating?: boolean;
  onTap?: () => void;
  size?: "small" | "medium" | "large";
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-amber-400 border-b-amber-400 border-r-transparent border-l-transparent animate-spin"></div>
        <div className="mt-4 text-amber-400 font-medium">
          {progress.toFixed(0)}% loaded
        </div>
      </div>
    </Html>
  );
}

// Actual 3D Coin component that will be rendered in the scene
function Coin3D({ isAnimating, onClick }: { isAnimating?: boolean; onClick?: () => void }) {
  return (
    <group 
      onClick={onClick} 
      scale={isAnimating ? 0.95 : 1} 
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      {/* Main coin body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.2, 64]} />
        <meshStandardMaterial 
          color="#F59E0B" 
          metalness={0.8} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Coin edge details */}
      <mesh position={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.9, 0.9, 0.02, 64]} />
        <meshStandardMaterial 
          color="#FCD34D" 
          metalness={0.7} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Coin rim */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#F59E0B" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Letter "P" in the middle */}
      <Text 
        position={[0, 0, 0.11]} 
        fontSize={0.7}
        color="#92400E"
        font="/fonts/Inter_Bold.json"
        anchorX="center"
        anchorY="middle"
      >
        P
      </Text>
      
      {/* Sparkle effect */}
      <pointLight position={[0.3, 0.3, 0.5]} intensity={0.6} color="#FFFFFF" />
    </group>
  );
}

export default function CoinScene({ 
  isAnimating = false, 
  onTap = () => {},
  size = "medium" 
}: CoinSceneProps) {
  // Adjust canvas dimensions based on size prop
  const getHeight = () => {
    switch(size) {
      case "small": return "h-32";
      case "large": return "h-96";
      default: return "h-64";
    }
  };
  
  return (
    <div className={`${getHeight()} w-full`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="cursor-pointer"
        shadows
      >
        <Suspense fallback={<Loader />}>
          <PresentationControls
            global
            rotation={[0.3, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 300 }}
          >
            <ambientLight intensity={0.8} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
            <directionalLight position={[-5, 5, 5]} intensity={1.2} castShadow />
            <Coin3D isAnimating={isAnimating} onClick={onTap} />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
