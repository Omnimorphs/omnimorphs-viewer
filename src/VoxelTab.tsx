import React, { useEffect, useRef, useState } from 'react';
import Scene from './Scene';
import './VoxelTab.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import VoxelModel from './VoxelModel';
import * as THREE from 'three';
import modelPaths, { MODEL_TYPE } from './services/modelPaths';

const model = modelPaths.get(MODEL_TYPE.VOXEL);

export type ModelTabProps = {
  activeAnimation: number;
};

function VoxelTab({ activeAnimation }: ModelTabProps) {
  const path = model.read();
  const gltf = useLoader(GLTFLoader, path);
  const mixer = useRef<THREE.AnimationMixer>(
    new THREE.AnimationMixer(gltf.scene)
  );
  const [currentAction, setCurrentAction] = useState(
    mixer.current.clipAction(gltf.animations[activeAnimation])
  );

  useEffect(() => {
    currentAction.stop();
    const action = mixer.current.clipAction(gltf.animations[activeAnimation]);
    action.play();
    setCurrentAction(action);
  }, [activeAnimation, mixer, gltf.animations, currentAction]);

  return (
    <section className="VoxelTab__root">
      <header className="VoxelTab__header" />
      <main className="VoxelTab__main">
        <Scene mixer={mixer}>
          <VoxelModel gltf={gltf} />
        </Scene>
      </main>
    </section>
  );
}

export default VoxelTab;
