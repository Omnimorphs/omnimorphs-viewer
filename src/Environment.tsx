import React, { useEffect, useRef } from 'react';
import {
  Canvas as ThreeCanvas,
  useFrame,
  useLoader,
  useThree
} from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationClip } from 'three';

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

function VoxelCanvasInner() {
  const { scene } = useThree();
  const mixer = useRef<THREE.AnimationMixer>();

  const gltf = useLoader(GLTFLoader, '/Omnimorph_00448.gltf');

  useFrame((_, delta) => {
    mixer.current && mixer.current.update(delta);
  });

  useEffect(() => {
    if (gltf) {
      mixer.current = new THREE.AnimationMixer(gltf.scene);
      const clip = gltf.animations.find(
        (_clip) => _clip.name === 'Walk 01'
      ) as AnimationClip;
      const action = mixer.current?.clipAction(clip);
      action.play();
    }
    new RGBELoader()
      .setPath('/')
      .load('clarens_night_02_2k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;
      });
  }, [scene, gltf]);

  return (
    <>
      <primitive
        position={new THREE.Vector3(2, -2.5, 2)}
        scale={new THREE.Vector3(0.09, 0.09, 0.09)}
        object={gltf.scene}
      />
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

function VoxelCanvas() {
  return (
    <ThreeCanvas gl={createRenderer} camera={cameraInitial}>
      <CameraController />
      <VoxelCanvasInner />
    </ThreeCanvas>
  );
}

export default VoxelCanvas;
