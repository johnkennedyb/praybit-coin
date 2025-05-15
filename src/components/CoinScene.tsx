
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls, useProgress, Html } from '@react-three/drei';
import Coin3D from './Coin3D';

interface CoinSceneProps {
  isAnimating?: boolean;
  onTap?: () => void;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-yellow-400 border-b-yellow-400 border-r-transparent border-l-transparent animate-spin"></div>
        <div className="mt-4 text-yellow-400 font-medium">
          {progress.toFixed(0)}% loaded
        </div>
      </div>
    </Html>
  );
}

export default function CoinScene({ isAnimating = false, onTap = () => {} }: CoinSceneProps) {
  return (
    <div className="h-64 w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="cursor-pointer"
        shadows
      >
        <Suspense fallback={<Loader />}>
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 300 }}
          >
            <Environment preset="sunset" />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <directionalLight position={[-5, 5, 5]} intensity={0.8} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Coin3D isAnimating={isAnimating} onClick={onTap} />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
