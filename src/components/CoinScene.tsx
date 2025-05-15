
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls } from '@react-three/drei';
import Coin3D from './Coin3D';

interface CoinSceneProps {
  isAnimating?: boolean;
  onTap?: () => void;
}

export default function CoinScene({ isAnimating = false, onTap = () => {} }: CoinSceneProps) {
  return (
    <div className="h-64 w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="cursor-pointer"
        shadows
      >
        <Suspense fallback={null}>
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Coin3D isAnimating={isAnimating} onClick={onTap} />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
