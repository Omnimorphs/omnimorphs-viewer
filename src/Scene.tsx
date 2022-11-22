import React, { useEffect, useRef } from 'react';
import {
  Canvas as ThreeCanvas,
  useFrame,
  useLoader,
  useThree
} from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Environment } from '@react-three/drei';
import { TextureLoader } from 'three';

const testMode = false;

const cameraInitial = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  100
);
cameraInitial.position.set(0, 3, -9);

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.maxPolarAngle = 1.85;
    controls.target.set(0, 0.5, 0);
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
  const { scene } = useThree();
  const dirLight = useRef<THREE.DirectionalLight>(null);
  const helper = useRef<THREE.CameraHelper>();
  const alphaMap = useLoader(TextureLoader, '/alpha_map.png');
  useFrame((_, delta) => {
    mixer.current && mixer.current.update(delta);
  });

  useEffect(() => {
    if (!dirLight.current) return;

    helper.current = new THREE.CameraHelper(dirLight.current?.shadow.camera);
    if (helper.current && testMode) {
      scene.add(helper.current);
    }

    return () => {
      if (helper.current) {
        scene.remove(helper.current);
      }
    };
  }, [scene, helper.current?.uuid]);

  return (
    <>
      <directionalLight
        ref={dirLight}
        intensity={0.5}
        position={new THREE.Vector3(-5, 10, -8)}
        target-position={new THREE.Vector3(0, 0, 10)}
        castShadow={true}
        shadow-mapSize-width={100}
        shadow-mapSize-height={100}
        shadow-darkness={1}
        shadow-camera-near={8}
        shadow-camera-far={30}
        shadow-camera-visible={true}
      />
      {children}
      <Environment background={true} files="hdri_test1668755041.hdr" path="/" />
      <mesh
        rotation-x={-Math.PI / 2}
        position={new THREE.Vector3(0, -2.5, 2)}
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
    <ThreeCanvas shadows={true} camera={cameraInitial}>
      <CameraController />
      <SceneInner mixer={mixer}>{children}</SceneInner>
    </ThreeCanvas>
  );
}

export default Scene;
