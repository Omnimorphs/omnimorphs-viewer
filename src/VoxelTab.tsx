import React, { useRef } from 'react';
import Environment from './Environment';
import './VoxelTab.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import VoxelModel from './VoxelModel';
import * as THREE from 'three';
import modelPaths, { MODEL_TYPE } from './services/modelPaths';

const model = modelPaths.get(MODEL_TYPE.VOXEL);

function VoxelTab() {
  const path = model.read();
  const gltf = useLoader(GLTFLoader, path);
  const mixer = useRef<THREE.AnimationMixer>(
    new THREE.AnimationMixer(gltf.scene)
  );

  return (
    <section className="VoxelTab__root">
      <header className="VoxelTab__header" />
      <main className="VoxelTab__main">
        <Environment mixer={mixer}>
          <VoxelModel gltf={gltf} />
        </Environment>
      </main>
    </section>
  );
}

export default VoxelTab;
