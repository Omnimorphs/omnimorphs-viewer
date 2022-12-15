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
    controls.enablePan = true;
    controls.enableZoom = true;
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
  const dirLightTop = useRef<THREE.DirectionalLight>(null);
  const dirLightBottom = useRef<THREE.DirectionalLight>(null);
  const helperTop = useRef<THREE.CameraHelper>();
  const helperBottom = useRef<THREE.CameraHelper>();
  const composer = useMemo(() => new EffectComposer(gl), [gl]);
  const renderScene = useMemo(
    () => new RenderPass(scene, camera),
    [scene, camera]
  );
  const bloomPass = useMemo(
    () =>
      new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.2,
        0.15,
        0.5
      ),
    []
  );
  // composer.addPass(renderScene);
  // composer.addPass(bloomPass);

  useFrame((_, delta) => {
    mixer.current && mixer.current.update(delta);
    // composer.render(delta);
  });

  useEffect(() => {
    if (!dirLightTop.current) return;
    if (!dirLightBottom.current) return;

    if (testMode) {
      helperTop.current = new THREE.CameraHelper(
        dirLightTop.current?.shadow.camera
      );
      if (helperTop.current) {
        scene.add(helperTop.current);
      }
      helperBottom.current = new THREE.CameraHelper(
        dirLightBottom.current?.shadow.camera
      );
      if (helperBottom.current) {
        scene.add(helperBottom.current);
      }
    }

    return () => {
      composer.removePass(renderScene);
      composer.removePass(bloomPass);
      if (helperTop.current) {
        scene.remove(helperTop.current);
      }
    };
  }, [
    scene,
    helperTop.current?.uuid,
    gl,
    camera,
    composer,
    renderScene,
    bloomPass
  ]);

  return (
    <>
      <directionalLight
        ref={dirLightBottom}
        color={new THREE.Color(0xffffff)}
        intensity={0.6}
        position={new THREE.Vector3(0, -5, -7)}
        target-position={new THREE.Vector3(0, 0, 0)}
        castShadow={true}
        shadow-mapSize-width={200}
        shadow-mapSize-height={200}
        shadow-darkness={1}
        shadow-camera-near={15}
        shadow-camera-far={35}
        shadow-camera-visible={true}
      />
      <directionalLight
        ref={dirLightTop}
        color={new THREE.Color(0xbaadba)}
        intensity={0.55}
        position={new THREE.Vector3(0, 10, -5)}
        target-position={new THREE.Vector3(0, 0, 0)}
        castShadow={true}
        shadow-mapSize-width={200}
        shadow-mapSize-height={200}
        shadow-darkness={1}
        shadow-camera-near={15}
        shadow-camera-far={35}
        shadow-camera-visible={true}
      />
      <ambientLight color={new THREE.Color(0x735178)} intensity={1} />
      <primitive
        object={envGltf.scene}
        position={new THREE.Vector3(0, -2.5, 0)}
        scale={new THREE.Vector3(2.5, 2.5, 2.5)}
        receiveShadow={true}
        castShadow={true}
      />
      {children}
      <Environment background={true} files="hdri.hdr" path="/" />
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
