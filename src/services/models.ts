import wrapPromise from './wrapPromise';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { treatSkeleton } from '../skeleton-utils/skeletonDirectioner';
import * as THREE from 'three';

export enum MODEL_TYPE {
  VOXEL,
  VRM
}

const GLTFCache: { [type: number]: GLTF } = {};

export class GLTFVRMLoader extends GLTFLoader {
  constructor(isVrm: boolean, ...rest: any) {
    super(...rest);
    if (isVrm) {
      this.register((parser) => new VRMLoaderPlugin(parser));
    }
  }
}

function models() {
  // TODO memoize API response
  const get = (type: MODEL_TYPE) => {
    return wrapPromise(
      new Promise<GLTF>((resolve) => {
        if (GLTFCache[type]) {
          resolve(GLTFCache[type]);
          return;
        }
        if (type === MODEL_TYPE.VRM) {
          const loader = new GLTFVRMLoader(true);
          loader.loadAsync('/Omnimorph_448.vrm').then((gltf) => {
            treatSkeleton(gltf);
            VRMUtils.removeUnnecessaryJoints(gltf.scene);

            const vrm = gltf.userData.vrm;
            const vrmModel = vrm.scene;
            const skeletonHelper = new THREE.SkeletonHelper(vrmModel);
            (vrmModel as any).skeleton = new THREE.Skeleton(
              skeletonHelper.bones
            );

            GLTFCache[type] = gltf;
            resolve(gltf);
          });
        } else {
          const loader = new GLTFVRMLoader(false);
          loader.loadAsync('/Omnimorph_00448.gltf').then((gltf) => {
            GLTFCache[type] = gltf;
            resolve(gltf);
          });
        }
      })
    );
  };

  return { get };
}

export default models();
