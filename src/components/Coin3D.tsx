
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
        {/* Coin base - front face */}
        <mesh castShadow receiveShadow position={[0, 0, 0.05]}>
          <cylinderGeometry args={[2, 2, 0.1, 64]} />
          <meshStandardMaterial 
            color="#ffd700"
            metalness={0.9}
            roughness={0.1}
            emissive="#ffb700"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Coin base - back face */}
        <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
          <cylinderGeometry args={[2, 2, 0.1, 64]} />
          <meshStandardMaterial 
            color="#ffd700"
            metalness={0.9}
            roughness={0.1}
            emissive="#ffb700"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Coin edge */}
        <mesh castShadow receiveShadow rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[2, 0.18, 16, 64]} />
          <meshStandardMaterial 
            color="#ffd700"
            metalness={0.9}
            roughness={0.2}
            emissive="#ff8f00"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Ring embossed on coin - front */}
        <mesh castShadow receiveShadow position={[0, 0, 0.11]}>
          <ringGeometry args={[1.6, 1.9, 64]} />
          <meshStandardMaterial 
            color="#ffdc73"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Ring embossed on coin - back */}
        <mesh castShadow receiveShadow position={[0, 0, -0.11]}>
          <ringGeometry args={[1.6, 1.9, 64]} />
          <meshStandardMaterial 
            color="#ffdc73"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* "PRAYBIT" text curved around top of coin - front */}
        <group position={[0, 0.8, 0.12]} rotation={[0, 0, 0]}>
          <Center>
            <Text3D
              font="/fonts/Inter_Bold.json"
              size={0.3}
              height={0.05}
              curveSegments={12}
            >
              PRAYBIT
              <meshStandardMaterial 
                color="#ffffff"
                metalness={0.7}
                roughness={0.2}
              />
            </Text3D>
          </Center>
        </group>
        
        {/* "COIN" text curved around bottom of coin - front */}
        <group position={[0, -0.8, 0.12]} rotation={[0, 0, 0]}>
          <Center>
            <Text3D
              font="/fonts/Inter_Bold.json"
              size={0.3}
              height={0.05}
              curveSegments={12}
            >
              COIN
              <meshStandardMaterial 
                color="#ffffff"
                metalness={0.7}
                roughness={0.2}
              />
            </Text3D>
          </Center>
        </group>
        
        {/* Central "P" on front of coin */}
        <Center position={[0, 0, 0.15]}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={1.2}
            height={0.1}
            curveSegments={24}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelSegments={3}
          >
            P
            <meshStandardMaterial 
              color="#ffffff"
              metalness={0.9}
              roughness={0.1}
              emissive="#ffffff"
              emissiveIntensity={0.3}
            />
          </Text3D>
        </Center>
        
        {/* Back side of coin design with symbol */}
        <Center position={[0, 0, -0.15]}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={0.8}
            height={0.1}
            curveSegments={12}
          >
            2025
            <meshStandardMaterial 
              color="#ffffff"
              metalness={0.8}
              roughness={0.2}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}
