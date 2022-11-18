import React, { useEffect } from 'react';
import {
  Canvas as ThreeCanvas,
  useFrame,
  useLoader,
  useThree
} from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Environment } from '@react-three/drei';
import { PCFSoftShadowMap, TextureLoader } from 'three';

const createRenderer = (canvas: any) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  return renderer;
};

const cameraInitial = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  100
);
cameraInitial.position.set(2, 2, -8);

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.maxPolarAngle = 1.8;
    controls.target.set(2, 0, 2);
    controls.update();
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

export type EnvironmentProps = {
  children: any;
  mixer: React.MutableRefObject<THREE.AnimationMixer | undefined>;
};

function SceneInner({ children, mixer }: EnvironmentProps) {
  const alphaMap = useLoader(TextureLoader, '/alpha_map.png');
  useFrame((_, delta) => {
    mixer.current && mixer.current.update(delta);
  });
  return (
    <>
      <directionalLight
        intensity={0.6}
        position={[0, 12, -6]}
        target-position={new THREE.Vector3(2, -2.5, 2)}
        castShadow={true}
      />
      {children}
      <Environment background={true} files="hdri_test1668755041.hdr" path="/" />
      <mesh
        rotation-x={-Math.PI / 2}
        position={new THREE.Vector3(2, -2.5, 2)}
        receiveShadow={true}
        castShadow={false}
      >
        <planeBufferGeometry args={[150, 150, 8, 8]} />
        <meshStandardMaterial
          color={0x177a90}
          alphaMap={alphaMap}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

function Scene({ children, mixer }: EnvironmentProps) {
  return (
    <ThreeCanvas gl={createRenderer} camera={cameraInitial}>
      <CameraController />
      <SceneInner mixer={mixer}>{children}</SceneInner>
    </ThreeCanvas>
  );
}

export default Scene;
