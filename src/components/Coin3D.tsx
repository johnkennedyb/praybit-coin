
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
  
  // Enhanced rotation animation
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      
      // Additional animation when tapping
      if (isAnimating) {
        mesh.current.rotation.z += 0.05;
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
        {/* Coin base with improved metallic look - front face */}
        <mesh castShadow receiveShadow position={[0, 0, 0.05]}>
          <cylinderGeometry args={[2, 2, 0.1, 64]} />
          <meshStandardMaterial 
            color="#ffdd3a"
            metalness={0.95}
            roughness={0.05}
            emissive="#ffb700"
            emissiveIntensity={0.6}
          />
        </mesh>
        
        {/* Coin base - back face */}
        <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
          <cylinderGeometry args={[2, 2, 0.1, 64]} />
          <meshStandardMaterial 
            color="#ffdd3a"
            metalness={0.95}
            roughness={0.05}
            emissive="#ffb700"
            emissiveIntensity={0.6}
          />
        </mesh>
        
        {/* Enhanced coin edge with better reflection */}
        <mesh castShadow receiveShadow rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[2, 0.18, 24, 96]} />
          <meshStandardMaterial 
            color="#ffe24d"
            metalness={0.98}
            roughness={0.05}
            emissive="#ff9500"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Improved inner ring embossed on coin - front */}
        <mesh castShadow receiveShadow position={[0, 0, 0.11]}>
          <ringGeometry args={[1.6, 1.9, 64]} />
          <meshStandardMaterial 
            color="#fff5b3"
            metalness={0.92}
            roughness={0.1}
            emissive="#fff0a0"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Improved inner ring embossed on coin - back */}
        <mesh castShadow receiveShadow position={[0, 0, -0.11]}>
          <ringGeometry args={[1.6, 1.9, 64]} />
          <meshStandardMaterial 
            color="#fff5b3"
            metalness={0.92}
            roughness={0.1}
            emissive="#fff0a0"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* "PRAYBIT" text with better styling around top of coin - front */}
        <group position={[0, 0.8, 0.12]} rotation={[0, 0, 0]}>
          <Center>
            <Text3D
              font="/fonts/Inter_Bold.json"
              size={0.28}
              height={0.08}
              curveSegments={32}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.01}
              bevelSegments={5}
            >
              PRAYBIT
              <meshStandardMaterial 
                color="#ffffff"
                metalness={0.85}
                roughness={0.05}
                emissive="#ffffff"
                emissiveIntensity={0.4}
              />
            </Text3D>
          </Center>
        </group>
        
        {/* "COIN" text with better styling around bottom of coin - front */}
        <group position={[0, -0.8, 0.12]} rotation={[0, 0, 0]}>
          <Center>
            <Text3D
              font="/fonts/Inter_Bold.json"
              size={0.28}
              height={0.08}
              curveSegments={32}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.01}
              bevelSegments={5}
            >
              COIN
              <meshStandardMaterial 
                color="#ffffff"
                metalness={0.85}
                roughness={0.05}
                emissive="#ffffff"
                emissiveIntensity={0.4}
              />
            </Text3D>
          </Center>
        </group>
        
        {/* Central "P" on front of coin with improved visibility */}
        <Center position={[0, 0, 0.15]}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={1.2}
            height={0.2}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.05}
            bevelSize={0.03}
            bevelSegments={8}
          >
            P
            <meshStandardMaterial 
              color="#ffffff"
              metalness={0.95}
              roughness={0.02}
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </Text3D>
        </Center>
        
        {/* Back side of coin design with improved symbol */}
        <Center position={[0, 0, -0.15]}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={0.8}
            height={0.15}
            curveSegments={24}
            bevelEnabled
            bevelThickness={0.03}
            bevelSize={0.02}
            bevelSegments={5}
          >
            2025
            <meshStandardMaterial 
              color="#ffffff"
              metalness={0.9}
              roughness={0.1}
              emissive="#ffffff"
              emissiveIntensity={0.3}
            />
          </Text3D>
        </Center>
        
        {/* Additional decorative elements - small circles on front */}
        <mesh castShadow receiveShadow position={[0, 1.4, 0.12]}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial 
            color="#ffffff"
            metalness={0.95}
            roughness={0.05}
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        <mesh castShadow receiveShadow position={[0, -1.4, 0.12]}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial 
            color="#ffffff"
            metalness={0.95}
            roughness={0.05}
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}
