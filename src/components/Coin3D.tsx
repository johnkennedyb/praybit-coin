
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import { Mesh } from 'three';

export default function Coin3D({ 
  isAnimating = false,
  onClick = () => {}
}: { 
  isAnimating?: boolean;
  onClick?: () => void;
}) {
  const mesh = useRef<Mesh>(null!);
  
  // Simple rotation animation
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      
      // Additional animation when tapping
      if (isAnimating) {
        mesh.current.rotation.z += 0.05;
        mesh.current.scale.x = Math.max(1, mesh.current.scale.x - 0.02);
        mesh.current.scale.y = Math.max(1, mesh.current.scale.y - 0.02);
      } else {
        mesh.current.scale.x = Math.min(1, mesh.current.scale.x + 0.02);
        mesh.current.scale.y = Math.min(1, mesh.current.scale.y + 0.02);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={mesh} onClick={onClick}>
        {/* Coin base */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2, 2, 0.2, 32]} />
          <meshStandardMaterial 
            color="#ffc107"
            metalness={0.8}
            roughness={0.2}
            emissive="#ff8f00"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Letter P on the coin */}
        <Center position={[0, 0.15, 0]}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={1.2}
            height={0.1}
            curveSegments={12}
          >
            P
            <meshStandardMaterial 
              color="#ffffff"
              metalness={0.5}
              roughness={0.3}
              emissive="#ffffff"
              emissiveIntensity={0.2}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}
