import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import * as THREE from 'three';
import { retargetClip } from 'three/examples/jsm/utils/SkeletonUtils';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import Scene from './Scene';
import './VrmTab.css';
import models, { MODEL_TYPE } from './services/models';
import VrmModel from './VrmModel';
import { getMapBonesForMixamoAnimRetarget } from './skeleton-utils/util';
import { ModelTabProps } from './VoxelTab';
import animations from './services/animations';
import Notice from './Notice';

const model = models.get(MODEL_TYPE.VRM);

const idleAnimationRes = animations('/anims/idle.fbx');
const hiAnimationRes = animations('/anims/hi.fbx');
const walkAnimationRes = animations('/anims/walking.fbx');

function VrmTab({ activeAnimation }: ModelTabProps) {
  const gltfObject = model.read();
  const gltf = gltfObject.GLTF;
  const idleAnimation = idleAnimationRes.read();
  const hiAnimation = hiAnimationRes.read();
  const walkAnimation = walkAnimationRes.read();
  const animations = useMemo(
    () => [idleAnimation, hiAnimation, walkAnimation],
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
      {!gltfObject.avatarUpToDate && (
        <Notice message="Avatar Not Yet Up To Date" />
      )}
      <header className="VrmTab__header" />
      <main className="VrmTab__main">
        <Scene mixer={mixer}>
          <VrmModel gltf={vrmObject.vrm} />
        </Scene>
      </main>
      <a
        href="https://cryptoavatars.io/collection/Omnimorphs"
        target="_parent"
        className="App_pwdBy"
        rel="noreferrer"
      >
        cryptoavatars.io
      </a>
    </section>
  );
}

export default VrmTab;

const createAction = (
  vrmModel: THREE.Group,
  fbx: THREE.Group,
  humanBones: any,
  mixer: MutableRefObject<THREE.AnimationMixer>
): THREE.AnimationAction => {
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

const createVrm = (gltf: GLTF) => {
  const vrm = gltf.userData.vrm;
  const vrmModel = vrm.scene;

  const mixer = new THREE.AnimationMixer(vrmModel);
  const humanBones = gltf.userData.vrm.humanoid.humanBones;

  return {
    vrm,
    vrmModel,
    mixer,
    humanBones
  };
};
