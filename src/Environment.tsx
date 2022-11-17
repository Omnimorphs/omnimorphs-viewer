import React, { useEffect } from 'react';
import {
  Canvas as ThreeCanvas,
  useFrame,
  useLoader,
  useThree
} from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const createRenderer = (canvas: any) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  return renderer;
};

const cameraInitial = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  100
);
cameraInitial.position.set(2, 0, 12);

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
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

function EnvironmentInner({ children, mixer }: EnvironmentProps) {
  const { scene } = useThree();
  const texture = useLoader(RGBELoader, '/clarens_night_02_2k.hdr');
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;

  useFrame((_, delta) => {
    mixer.current && mixer.current.update(delta);
  });

  return (
    <>
      {children}
      {/* TODO the proper stage */}
      <mesh
        position={new THREE.Vector3(2, -4, 2)}
        scale={new THREE.Vector3(3, 3, 3)}
      >
        <boxGeometry />
        <meshBasicMaterial color="royalblue" />
      </mesh>
    </>
  );
}

function Environment({ children, mixer }: EnvironmentProps) {
  return (
    <ThreeCanvas gl={createRenderer} camera={cameraInitial}>
      <CameraController />
      <EnvironmentInner mixer={mixer}>{children}</EnvironmentInner>
    </ThreeCanvas>
  );
}

export default Environment;
