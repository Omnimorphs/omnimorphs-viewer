import React from 'react';
import * as THREE from 'three';
import { ObjectMap } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export type ModelProps = {
  gltf: GLTF & ObjectMap;
};

function VoxelModel({ gltf }: ModelProps) {
  return (
    <primitive
      castShadow={true}
      receiveShadow={true}
      position={new THREE.Vector3(2, -2.5, 2)}
      scale={new THREE.Vector3(0.09, 0.09, 0.09)}
      rotation-y={160}
      object={gltf.scene}
    />
  );
}

export default VoxelModel;
