import wrapPromise from './wrapPromise';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { treatSkeleton } from '../skeleton-utils/skeletonDirectioner';
import * as THREE from 'three';
import api from './api';

export enum MODEL_TYPE {
  VOXEL,
  VRM
}

export type GLTFObject = {
  GLTF: GLTF;
  avatarUpToDate: boolean;
};

const GLTFCache: { [type: number]: GLTFObject } = {};

export class GLTFVRMLoader extends GLTFLoader {
  constructor(isVrm: boolean, ...rest: any) {
    super(...rest);
    if (isVrm) {
      this.register((parser) => new VRMLoaderPlugin(parser));
    }
  }
}

const assetTypes = {
  [MODEL_TYPE.VRM]: 'default',
  [MODEL_TYPE.VOXEL]: 'nexus-voxel'
};

function models() {
  const get = (type: MODEL_TYPE) => {
    return wrapPromise(
      new Promise<GLTFObject>((resolve) => {
        if (GLTFCache[type]) {
          resolve(GLTFCache[type]);
          return;
        }
        if ([MODEL_TYPE.VRM, MODEL_TYPE.VOXEL].includes(type)) {
          api().then((resp) => {
            const asset = resp.metadata.assets.find(
              (a: any) =>
                a.media_type === 'model' && a.asset_type === assetTypes[type]
            );
            const file = asset.files.find(
              (f: any) => f.file_type === 'model/vrm'
            );
            const loader = new GLTFVRMLoader(true);
            loader.loadAsync(file.url).then((gltf) => {
              treatSkeleton(gltf);
              VRMUtils.removeUnnecessaryJoints(gltf.scene);

              const vrm = gltf.userData.vrm;
              const vrmModel = vrm.scene;
              const skeletonHelper = new THREE.SkeletonHelper(vrmModel);
              (vrmModel as any).skeleton = new THREE.Skeleton(
                skeletonHelper.bones
              );

              GLTFCache[type] = {
                GLTF: gltf,
                avatarUpToDate: resp.metadata.avatarsUpToDate
              };
              resolve(GLTFCache[type]);
            });
          });
        } else {
          throw new Error('Unknown model type');
        }
      })
    );
  };

  return { get };
}

export default models();
