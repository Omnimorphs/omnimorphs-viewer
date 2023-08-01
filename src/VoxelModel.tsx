import React from 'react';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export type ModelProps = {
  gltf: GLTF;
};

function VoxelModel({ gltf }: ModelProps) {
  gltf.scene.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
  });
  return (
    <primitive
      position={new THREE.Vector3(0, -3.25, 0)}
      scale={new THREE.Vector3(3.25, 3.25, 3.25)}
      rotation-y={160}
      object={gltf.scene}
    />
  );
}

export default VoxelModel;
