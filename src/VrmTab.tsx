import React, { useRef } from 'react';
import Environment from './Environment';
import './VrmTab.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import modelPaths, { MODEL_TYPE } from './services/modelPaths';
import VrmModel from './VrmModel';

const model = modelPaths.get(MODEL_TYPE.VRM);

function VrmTab() {
  const path = model.read();
  const gltf = useLoader(GLTFLoader, path);
  const mixer = useRef<THREE.AnimationMixer>(
    new THREE.AnimationMixer(gltf.scene)
  );

  return (
    <section className="VrmTab__root">
      <header className="VrmTab__header" />
      <main className="VrmTab__main">
        <Environment mixer={mixer}>
          <VrmModel gltf={gltf} />
        </Environment>
      </main>
    </section>
  );
}

export default VrmTab;
