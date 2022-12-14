import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas as ThreeCanvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Environment } from '@react-three/drei';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { useGLTF } from '@react-three/drei';

const testMode = false;

const cameraInitial = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  100
);
cameraInitial.position.set(0, 3, -10);

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.maxPolarAngle = 1.8;
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
  const { scene, gl, camera } = useThree();
  const envGltf = useGLTF('/envtest.glb');
  const dirLight = useRef<THREE.DirectionalLight>(null);
  const helper = useRef<THREE.CameraHelper>();
  const composer = useMemo(() => new EffectComposer(gl), [gl]);
  const renderScene = useMemo(
    () => new RenderPass(scene, camera),
    [scene, camera]
  );
  const bloomPass = useMemo(
    () =>
      new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.3,
        0.1,
        0.1
      ),
    []
  );
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  useFrame((_, delta) => {
    mixer.current && mixer.current.update(delta);
    composer.render(delta);
  }, 1);

  useEffect(() => {
    if (!dirLight.current) return;

    if (testMode) {
      helper.current = new THREE.CameraHelper(dirLight.current?.shadow.camera);
      if (helper.current) {
        scene.add(helper.current);
      }
    }

    return () => {
      composer.removePass(renderScene);
      composer.removePass(bloomPass);
      if (helper.current) {
        scene.remove(helper.current);
      }
    };
  }, [
    scene,
    helper.current?.uuid,
    gl,
    camera,
    composer,
    renderScene,
    bloomPass
  ]);

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
      <primitive
        object={envGltf.scene}
        position={new THREE.Vector3(0, -2.5, 0)}
        scale={new THREE.Vector3(2.5, 2.5, 2.5)}
        receiveShadow={true}
        castShadow={true}
      />
      {children}
      <Environment background={true} files="hdri_test1668755041.hdr" path="/" />
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
