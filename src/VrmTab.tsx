import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import * as THREE from 'three';
import { retargetClip } from 'three/examples/jsm/utils/SkeletonUtils';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ObjectMap, useLoader } from '@react-three/fiber';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import Scene from './Scene';
import './VrmTab.css';
import modelPaths, { MODEL_TYPE } from './services/modelPaths';
import VrmModel from './VrmModel';
import { getMapBonesForMixamoAnimRetarget } from './skeleton-utils/util';
import { ModelTabProps } from './VoxelTab';
import { treatSkeleton } from './skeleton-utils/skeletonDirectioner';

const model = modelPaths.get(MODEL_TYPE.VRM);

export class GLTFVRMLoader extends GLTFLoader {
  constructor(...rest: any) {
    super(...rest);
    this.register((parser) => new VRMLoaderPlugin(parser));
  }
}

const createAction = (
  vrmModel: THREE.Group,
  fbx: THREE.Group,
  humanBones: any,
  mixer: MutableRefObject<THREE.AnimationMixer>
): THREE.AnimationAction => {
  console.log('creating action');
  const animationHelper = new THREE.SkeletonHelper(fbx);
  (animationHelper as any).skeleton = new THREE.Skeleton(animationHelper.bones);
  // some animation has 2 clips but first clip has no tracks
  const animationOriginal = fbx.animations[0].tracks[0]
    ? fbx.animations[0]
    : fbx.animations[1];
  const retargetBoneMap = getMapBonesForMixamoAnimRetarget(humanBones);
  const clip = retargetClip(
    vrmModel,
    animationHelper,
    animationOriginal,
    retargetBoneMap
  );
  return mixer.current.clipAction(
    clip,
    vrmModel,
    THREE.NormalAnimationBlendMode
  );
};

const createVrm = (gltf: GLTF & ObjectMap) => {
  console.log('creating VRM');
  treatSkeleton(gltf);
  VRMUtils.removeUnnecessaryJoints(gltf.scene);

  const vrm = gltf.userData.vrm;
  const vrmModel = vrm.scene;

  const mixer = new THREE.AnimationMixer(vrmModel);
  const skeletonHelper = new THREE.SkeletonHelper(vrmModel);
  (vrmModel as any).skeleton = new THREE.Skeleton(skeletonHelper.bones);
  const humanBones = gltf.userData.vrm.humanoid.humanBones;

  return {
    vrm,
    vrmModel,
    mixer,
    humanBones
  };
};

function VrmTab({ activeAnimation }: ModelTabProps) {
  const path = model.read();
  const gltf = useLoader(GLTFVRMLoader, path);
  const idleAnimation = useLoader(FBXLoader, '/anims/idle.fbx');
  const hiAnimation = useLoader(FBXLoader, '/anims/hi.fbx');
  const walkAnimation = useLoader(FBXLoader, '/anims/walking.fbx');
  const animations = useMemo(
    () =>
      [idleAnimation, hiAnimation, walkAnimation].map((fbx) => {
        // some animation has 2 clips but first clip has no tracks
        const animationOriginal = fbx.animations[0].tracks[0]
          ? fbx.animations[0]
          : fbx.animations[1];
        const trackHipPosition = animationOriginal.tracks[0];
        // Mixamo fbx scale are x100 comparing with other formats
        trackHipPosition.values.forEach((value, index, values) => {
          values[index] *= 0.01;
        });
        return fbx;
      }),
    [hiAnimation, idleAnimation, walkAnimation]
  );

  const vrmObject = useMemo(() => createVrm(gltf), [gltf]);

  const mixer = useRef(vrmObject.mixer);

  const [currentAction, setCurrentAction] =
    useState<THREE.AnimationAction | null>(null);

  useEffect(() => {
    if (currentAction) {
      // stopping prev action
      currentAction.stop();
    }
    const action = createAction(
      vrmObject.vrmModel,
      animations[activeAnimation],
      vrmObject.humanBones,
      mixer
    );
    action.play();
    setCurrentAction(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAnimation]);

  return (
    <section className="VrmTab__root">
      <header className="VrmTab__header" />
      <main className="VrmTab__main">
        <Scene mixer={mixer}>
          <VrmModel gltf={vrmObject.vrm} />
        </Scene>
      </main>
    </section>
  );
}

export default VrmTab;
