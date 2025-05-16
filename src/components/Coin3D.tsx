
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
      
      // Animation when tapping
      if (isAnimating) {
        mesh.current.scale.x = Math.max(0.9, mesh.current.scale.x - 0.02);
        mesh.current.scale.y = Math.max(0.9, mesh.current.scale.y - 0.02);
      } else {
        mesh.current.scale.x = Math.min(1, mesh.current.scale.x + 0.02);
        mesh.current.scale.y = Math.min(1, mesh.current.scale.y + 0.02);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={mesh} onClick={onClick}>
        {/* Simplified coin base - front face */}
        <mesh castShadow receiveShadow position={[0, 0, 0.05]}>
          <cylinderGeometry args={[2, 2, 0.1, 32]} />
          <meshStandardMaterial 
            color="#ffdd3a"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        
        {/* Coin base - back face */}
        <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
          <cylinderGeometry args={[2, 2, 0.1, 32]} />
          <meshStandardMaterial 
            color="#ffdd3a"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        
        {/* Simple coin edge */}
        <mesh castShadow receiveShadow rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[2, 0.15, 16, 32]} />
          <meshStandardMaterial 
            color="#ffe24d"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Simple "P" on front of coin */}
        <Center position={[0, 0, 0.15]}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={1.2}
            height={0.1}
            curveSegments={16}
            bevelEnabled
            bevelThickness={0.03}
            bevelSize={0.01}
            bevelSegments={3}
          >
            P
            <meshStandardMaterial 
              color="#ffffff"
              metalness={0.5}
              roughness={0.5}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}
