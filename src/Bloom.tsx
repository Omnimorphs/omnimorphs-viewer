import React, { useRef } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { extend, useFrame, useThree } from '@react-three/fiber';

extend({ EffectComposer, RenderPass, UnrealBloomPass });

function Bloom() {
  const { gl, camera, scene } = useThree();
  const composer = useRef<EffectComposer>() as any;
  useFrame(() => composer.current?.render());
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass scene={scene} camera={camera} />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <unrealBloomPass args={[10000, 1.5, 1, 0]} />
    </effectComposer>
  );
}

export default Bloom;
